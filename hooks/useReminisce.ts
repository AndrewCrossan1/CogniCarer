import {useState} from "react";
import {ReminisceEntry, Picture, UserAlbum} from "@/services/api/types";
import API from "@/services/api/api";
import {usePatients} from "@/hooks/patients/usePatients";

export const useReminisce = () => {
    const [loading, setLoading] = useState(false);
    const [entries, setEntries] = useState([] as ReminisceEntry[]);
    const [albums, setAlbums] = useState([] as UserAlbum[]);
    const [pictures, setPictures] = useState([] as Picture[]);
    const [error, setError] = useState<string | null>(null);

    const { getPatient } = usePatients();

    const getEntries = async (): Promise<ReminisceEntry> => {
        setLoading(true);

        const response = await API.get("reminisce/entries/");

        setEntries(response);
        setLoading(false);

        // Convert the response to a ReminisceEntry object
        return response;
    }

    const getAlbums = async (): Promise<UserAlbum[] | null> => {
        setLoading(true);

        const response = await API.get("reminisce/user-albums/");

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

        const response = await API.get(`reminisce/user-albums/${albumId}/`);

        if (response) {
            setLoading(false);
            return response.name;
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
            });
        }


        setPictures(response);
        setLoading(false);

        // Convert the response to a Picture object
        return response;
    }

    return { entries, getEntries, albums, getAlbums, pictures, getPictures, loading, error, getAlbumName };
}
