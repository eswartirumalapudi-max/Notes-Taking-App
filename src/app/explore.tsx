
import { router } from 'expo-router';
import { Box, Button, Heading, Text, VStack } from 'native-base';

export default function ExploreScreen() {
  return (
    <Box flex={1} bg="coolGray.100" safeArea p={5}>
      <VStack space={5}>
        <Heading size="2xl" color="blue.700">
          Explore
        </Heading>

        <Text color="coolGray.600" fontSize="md">
          Welcome to your personal Notes App.
        </Text>

        <Box bg="white" p={5} rounded="xl" shadow={2}>
          <Heading size="md" mb={2}>
            Organize Your Thoughts
          </Heading>
          <Text color="coolGray.600">
            Create categories and keep your notes organized in one place.
          </Text>
          <Button mt={4} onPress={() => router.replace('/')}>
            Go to My Notes
          </Button>
        </Box>

        <Box bg="white" p={5} rounded="xl" shadow={2}>
          <Heading size="md" mb={2}>
            Your Privacy
          </Heading>
          <Text color="coolGray.600">
            Your notes are stored locally on your device. Your account is
            securely managed through Supabase Authentication.
          </Text>
        </Box>

        <Box bg="white" p={5} rounded="xl" shadow={2}>
          <Heading size="md" mb={2}>
            Features
          </Heading>
          <VStack space={2}>
            <Text>✓ Create and organize categories</Text>
            <Text>✓ Add and edit notes</Text>
            <Text>✓ Delete unwanted notes</Text>
            <Text>✓ Search your notes</Text>
            <Text>✓ Secure account authentication</Text>
            <Text>✓ Local storage for notes</Text>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
}
