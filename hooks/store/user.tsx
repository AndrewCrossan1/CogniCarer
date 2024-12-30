import { useAppSelector, useAppDispatch } from "@/hooks/store/hooks";

import { setUser, deleteUser } from "@/services/store/slices/userSlice";
import {User} from "@/services/api/types";

export const useUser = () => {
    const user = useAppSelector(state => state.user.user);
    const dispatch = useAppDispatch();

    const setUserAction = (user: User | null) => {
        dispatch(setUser(user));
    };

    const deleteUserAction = () => {
        dispatch(deleteUser());
    };

    return { user, setUser: setUserAction, deleteUser: deleteUserAction };
}