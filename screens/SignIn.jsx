
import { KeyboardAvoidingView, Text } from "react-native";
import { TouchableOpacity } from "react-native";

function SignIn({promptAsync}) {
  return (
    <KeyboardAvoidingView className="flex-1 items-center justify-center bg-blue-600">
            <TouchableOpacity
                onPress={() =>promptAsync()}
                className="h-10 w-10/12 justify-center items-center flex bg-red-300"
            >
                <Text className="text-bold">Google Signin</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
  )
}

export default SignIn