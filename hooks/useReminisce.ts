import {useState} from "react";
import {Picture, ReminisceEntry, UserAlbum} from "@/services/api/types";
import API from "@/services/api/api";
import {usePatients} from "@/hooks/patients/usePatients";
import {useAppSelector} from "@/hooks/store/hooks";

export const useReminisce = () => {
    const [loading, setLoading] = useState(false);
    const [entries, setEntries] = useState([] as ReminisceEntry[]);
    const [albums, setAlbums] = useState([] as UserAlbum[]);
    const [pictures, setPictures] = useState([] as Picture[]);
    const [error, setError] = useState<string | null>(null);
    const user = useAppSelector(state => state.user.user);

    const { getPatient } = usePatients();

    const getEntries = async (): Promise<ReminisceEntry[] | null> => {
        setLoading(true);

        const response = await API.get("reminisce/entries/");

        if (response) {
            setEntries(response);
            for (const entry of response) {
                getPatient(entry.patient).then((patient) => {
                    // @ts-ignore
                    entry.patientActual = patient;
                });
                getPictures().then((pictures) => {
                    // @ts-ignore
                    entry.pictureActual = pictures.find((picture) => picture.uuid === entry.picture);
                });
                // @ts-ignore
                entry.userActual = user;
            }
            setLoading(false);
            return response;
        }

        setLoading(false);
        setError("No entries found");
        return null;
    }

    const getAlbums = async (): Promise<UserAlbum[] | null> => {
        setLoading(true);

        const response = await API.get("reminisce/albums/");

        if (response) {
            setAlbums(response);
            response.forEach(async (album: UserAlbum) => {
                getPatient(album.patient).then((patient) => {
                    // @ts-ignore
                    album.patientActual = patient;
                });
            });
            setLoading(false);
            return response;
        }

        setLoading(false);
        setError("No albums found");
        return null;
    }

    const getAlbumName = async (albumId: string): Promise<string | null> => {
        setLoading(true);

        const response = await API.get(`reminisce/album/${albumId}/`);

        if (response) {
            setLoading(false);
            return response.name;
        }

        setLoading(false);
        setError("Album not found");
        return null;
    }

    const getAlbum = async (albumName: string): Promise<string | null> => {
        setLoading(true);

        const response = await API.get(`reminisce/album/${albumName}/`);

        if (response) {
            setLoading(false);
            return response;
        }

        setLoading(false);
        setError("Album not found");
        return null;
    }

    const getPictures = async (): Promise<Picture[] | null> => {
        setLoading(true);

        const response = await API.get("reminisce/pictures/");

        // Set the album data
        const albumData = await getAlbums();

        if (albumData) {
            response.forEach((picture: Picture) => {
                const album = albumData.find((album: UserAlbum) => album.uuid === picture.album);
                if (album) {
                    picture.albumActual = album;
                }
                getPatient(picture.patient).then((patient) => {
                    // @ts-ignore
                    picture.patientActual = patient;
                });
            });
        }


        setPictures(response);
        setLoading(false);

        // Convert the response to a Picture object
        return response;
    }

    interface DeleteProps {
        type: "entries" | "albums" | "pictures";
        id: string;
    }

    const deleteItem = async ({ type, id }: DeleteProps) => {
        const response = await API.delete(`reminisce/${type}/${id}/`);

        if (response) {
            switch (type) {
                case "entries":
                    setEntries(entries.filter((entry) => entry.uuid !== id));
                    break;
                case "albums":
                    setAlbums(albums.filter((album) => album.uuid !== id));
                    break;
                case "pictures":
                    setPictures(pictures.filter((picture) => picture.uuid !== id));
                    break;
            }
        }
        return response;
    }

    const newAlbum = async (data: { title: string, description: string, patient: string, user: string }) => {
        const response = await API.POST("reminisce/albums/", data);

        if (response) {
            setAlbums([...albums, response]);
        } else {
            console.error("Error creating album");
        }

        return response;
    }

    const newPicture = async (data: { title: string, patient: string, album?: string, user: string}, image: any) => {
        //
        const response = await API.image_post("reminisce/pictures/", data, image);

        if (response) {
            setPictures([...pictures, response]);
        } else {
            console.error("Error creating picture");
        }

        return response;
    }

    const newEntry = async (data: { patient: string, picture: string, notes: string, date_taken: string }) => {
        setLoading(true);

        const response = await API.POST("reminisce/entries/", data);

        if (response) {
            setEntries([...entries, response]);
        } else {
            console.debug("Error creating entry");
        }

        setLoading(false);
        return response
    }

    const getEntry = async (entryId: string): Promise<ReminisceEntry | null> => {
        setLoading(true);

        const response = await API.get(`reminisce/entry/${entryId}/`);

        if (response) {
            setLoading(false);
            return response;
        }

        setLoading(false);
        setError("Entry not found");
        return null;
    }

    const update = async (type: "entry" | "album" | "picture", id: string, data: any) => {
        setLoading(true);

        const response = await API.put(`reminisce/${type}/${id}/`, data);

        if (response) {
            switch (type) {
                case "entry":
                    setEntries(entries.map((entry) => entry.uuid === id ? response : entry));
                    break;
                case "album":
                    setAlbums(albums.map((album) => album.uuid === id ? response : album));
                    break;
                case "picture":
                    setPictures(pictures.map((picture) => picture.uuid === id ? response : picture));
                    break;
            }
        }

        setLoading(false);
        return response;
    }

    /**
     * Get the number of entries made today
     * @returns {Promise<number | null>} The number of entries made today or null if an error occurred
     */
    const entriesToday = async (): Promise<number | null> => {
        setLoading(true);

        const response = await API.get("reminisce/entries/today/");

        if (response) {
            setLoading(false);
            return response.count;
        }

        setLoading(false);
        setError("No entries found");
        return null;
    }

    /**
     * Return the percentage of family members reminisced with
     * @returns {Promise<string | null>} The percentage of family members reminisced with or null if an error occurred
     */
    const familyReminisced = async (): Promise<string> => {
        setLoading(true);

        const response = await API.get("reminisce/entries/family-today/");

        if (response) {
            setLoading(false);
            return response.count;
        }

        setLoading(false);
        setError("No family members found");
        return "0%"
    }

    return { entries, getEntries, albums, getAlbums, pictures, deleteItem, getPictures, loading, error, getAlbumName, newAlbum, getAlbum, newPicture, newEntry, getEntry, update, entriesToday, familyReminisced };
}
