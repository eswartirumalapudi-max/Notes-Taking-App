
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import {
  Box,
  Button,
  HStack,
  Heading,
  Input,
  Pressable,
  ScrollView,
  Spinner,
  Text,
  VStack
} from 'native-base';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../../lib/supabase';

type Category = {
  id: string;
  name: string;
};

type Note = {
  id: string;
  title: string;
  content: string;
  categoryId: string;
};

export default function HomeScreen() {
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState<Category[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selected, setSelected] = useState<Category | null>(null);

  const [categoryName, setCategoryName] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [search, setSearch] = useState('');

  const [showCategory, setShowCategory] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      const { data } = await supabase.auth.getSession();

      if (!mounted) return;

      if (!data.session) {
        router.replace('/login');
        setLoading(false);
        return;
      }

      const id = data.session.user.id;
      setUserId(id);

      const savedCategories = await AsyncStorage.getItem(`categories_${id}`);
      const savedNotes = await AsyncStorage.getItem(`notes_${id}`);

      if (!mounted) return;

      if (savedCategories) setCategories(JSON.parse(savedCategories));
      if (savedNotes) setNotes(JSON.parse(savedNotes));

      setLoading(false);
    };

    loadUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          router.replace('/login');
        }
      }
    );

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const saveCategories = async (data: Category[]) => {
    setCategories(data);
    await AsyncStorage.setItem(
      `categories_${userId}`,
      JSON.stringify(data)
    );
  };

  const saveNotes = async (data: Note[]) => {
    setNotes(data);
    await AsyncStorage.setItem(
      `notes_${userId}`,
      JSON.stringify(data)
    );
  };

  const addCategory = async () => {
    if (!categoryName.trim()) {
      Alert.alert('Enter a category name');
      return;
    }

    const category = {
      id: Date.now().toString(),
      name: categoryName.trim(),
    };

    await saveCategories([...categories, category]);
    setCategoryName('');
    setShowCategory(false);
  };

  const openNewNote = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setShowNote(true);
  };

  const openEditNote = (note: Note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setShowNote(true);
  };

  const saveNote = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Missing details', 'Enter a title and note content.');
      return;
    }

    if (!selected) return;

    if (editingId) {
      const updated = notes.map((note) =>
        note.id === editingId
          ? { ...note, title: title.trim(), content: content.trim() }
          : note
      );

      await saveNotes(updated);
    } else {
      const note: Note = {
        id: Date.now().toString(),
        title: title.trim(),
        content: content.trim(),
        categoryId: selected.id,
      };

      await saveNotes([...notes, note]);
    }

    setTitle('');
    setContent('');
    setEditingId(null);
    setShowNote(false);
  };

  const deleteNote = (id: string) => {
    Alert.alert('Delete note?', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => saveNotes(notes.filter((note) => note.id !== id)),
      },
    ]);
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      router.replace('/login');
    }
  };

  if (loading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Spinner size="lg" color="blue.600" />
        <Text mt={3}>Loading your notes...</Text>
      </Box>
    );
  }

  return (
    <Box flex={1} bg="coolGray.100" safeArea>
      <HStack
        px={4}
        py={4}
        bg="white"
        justifyContent="space-between"
        alignItems="center"
      >
        <Heading color="blue.700" size="xl">
          My Notes 📝
        </Heading>
        <Button size="sm" variant="outline" onPress={signOut}>
          Logout
        </Button>
      </HStack>

      <ScrollView px={4} py={4}>
        {!selected ? (
          <VStack space={4}>
            <Heading size="md">My Categories</Heading>

            <Button onPress={() => setShowCategory(!showCategory)}>
              + Add Category
            </Button>

            {showCategory && (
              <VStack space={2} bg="white" p={4} rounded="lg">
                <Input
                  placeholder="Enter category name"
                  value={categoryName}
                  onChangeText={setCategoryName}
                />
                <Button onPress={addCategory}>Save Category</Button>
              </VStack>
            )}

            {categories.length === 0 ? (
              <Text color="coolGray.500" textAlign="center" mt={8}>
                No categories yet. Create your first category!
              </Text>
            ) : (
              categories.map((category) => (
                <Pressable
                  key={category.id}
                  onPress={() => setSelected(category)}
                  bg="white"
                  p={4}
                  rounded="lg"
                  shadow={1}
                >
                  <HStack justifyContent="space-between" alignItems="center">
                    <Text fontSize="md" fontWeight="semibold">
                      📁 {category.name}
                    </Text>
                    <Text color="blue.600">
                      {notes.filter((n) => n.categoryId === category.id).length} notes →
                    </Text>
                  </HStack>
                </Pressable>
              ))
            )}
          </VStack>
        ) : (
          <VStack space={4}>
            <Button
              variant="ghost"
              alignSelf="flex-start"
              onPress={() => {
                setSelected(null);
                setSearch('');
              }}
            >
              ← Back to Categories
            </Button>

            <Heading size="lg">{selected.name}</Heading>

            <Input
              placeholder="Search notes..."
              value={search}
              onChangeText={setSearch}
              bg="white"
            />

            <Button onPress={openNewNote}>+ Create New Note</Button>

            {notes
              .filter((note) => note.categoryId === selected.id)
              .filter(
                (note) =>
                  note.title.toLowerCase().includes(search.toLowerCase()) ||
                  note.content.toLowerCase().includes(search.toLowerCase())
              )
              .map((note) => (
                <Box key={note.id} bg="white" p={4} rounded="lg" shadow={1}>
                  <Heading size="sm">{note.title}</Heading>
                  <Text mt={2} color="coolGray.600">
                    {note.content}
                  </Text>

                  <HStack space={2} mt={3}>
                    <Button
                      size="sm"
                      variant="outline"
                      onPress={() => openEditNote(note)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="danger"
                      variant="outline"
                      onPress={() => deleteNote(note.id)}
                    >
                      Delete
                    </Button>
                  </HStack>
                </Box>
              ))}

            {notes.filter((note) => note.categoryId === selected.id).length === 0 && (
              <Text textAlign="center" color="coolGray.500" mt={6}>
                No notes in this category yet.
              </Text>
            )}
          </VStack>
        )}
      </ScrollView>

      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        display={showNote ? 'flex' : 'none'}
        bg="black"
        opacity={0.95}
        p={5}
        justifyContent="center"
      >
        <Box bg="white" p={5} rounded="xl">
          <VStack space={3}>
            <Heading size="lg">
              {editingId ? 'Edit Note' : 'Create Note'}
            </Heading>

            <Input
              placeholder="Note title"
              value={title}
              onChangeText={setTitle}
            />

            <Input
  placeholder="Write your note here..."
  value={content}
  onChangeText={setContent}
  multiline
  h={32}
  textAlignVertical="top"
/>

            <Button onPress={saveNote}>
              Save Note
            </Button>

            <Button
              variant="ghost"
              colorScheme="coolGray"
              onPress={() => setShowNote(false)}
            >
              Cancel
            </Button>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
}
