import {Stack} from "expo-router";

/**
 * Layout for the Reminisce module
 * Contains the main layout for the Reminisce module
 *
 * Contains the following slots:
 * - index
 * - (tabs)
 *      - Albums - Contains the list of albums
 *      - Entries - Contains the list of entries
 *      - New Entry - Contains the form for creating a new entry
 *      - Pictures - Contains the list of pictures
 * @constructor
 * @return JSX.Element
 */
export default function Layout() {
    return (
        <Stack>
            <Stack.Screen name="(tabs)"
                          options={{ headerShown: false }}
            />
        </Stack>
    )
}