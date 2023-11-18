import { Button, View } from "react-native";

function Main({onSignOut}) {

    return (
        <View className="flex-1 items-center justify-center">   
            <Button title="SignOut" onPress={onSignOut} />
        </View>
    );
}

export default Main;
