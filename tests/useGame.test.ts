import {act, renderHook} from '@testing-library/react-native';
import { useGame } from '@/hooks/games/useGame';
import API from "@/services/api/api";
import {ImagePickerResult} from "expo-image-picker";

// Mock the API module
jest.mock('@/services/api/api', () => ({
    get: jest.fn(),
    multiple_image_post: jest.fn(),
}));

describe('Test getGames() from useGame', () => {
    it('Should return a list of Games', async () => {
        // Mock the API response
        const response = [{ uuid: '123', name: 'Test Game' }];
        (API.get as jest.Mock).mockResolvedValue(response);

        const { result } = renderHook(() => useGame());

        await act(async () => {
            const games = await result.current.getGames();
            expect(games).toEqual(response);
        });

        expect(API.get).toHaveBeenCalledWith('/games/matches/');
        expect(result.current.loading).toBeFalsy();
        expect(result.current.error).toBeNull();
    });
})

describe('Test getGame() from useGame', () => {
    it('Should return a single Game', async () => {
        // Mock the API response
        const response = { uuid: '123', name: 'Test Game' };
        (API.get as jest.Mock).mockResolvedValue(response);

        const { result } = renderHook(() => useGame());

        await act(async () => {
            const game = await result.current.getGame('123');
            expect(game).toEqual(response);
        });

        expect(API.get).toHaveBeenCalledWith('/games/matches/123/');
        expect(result.current.loading).toBeFalsy();
        expect(result.current.error).toBeNull();
    });
});

describe('Test getLatestGame() from useGame', () => {
    it('Should return a single Game', async () => {
        // Mock the API responseA
        const response = { uuid: '123', name: 'Test Game' };
        (API.get as jest.Mock).mockResolvedValue(response);

        const { result } = renderHook(() => useGame());

        await act(async () => {
            const game = await result.current.getLatestGame();
            expect(game).toEqual(response);
        });

        expect(API.get).toHaveBeenCalledWith('/games/matches/latest/');
        expect(result.current.loading).toBeFalsy();
        expect(result.current.error).toBeNull();
    });
});

describe('Test createGame() from useGame', () => {
    it('Should return True if the game is created', async () => {
        // Mock the API response
        const response = {uuid: '123', name: 'Test Game', image: 'test.jpg'};
        (API.multiple_image_post as jest.Mock).mockResolvedValue(response);

        const {result} = renderHook(() => useGame());

        const fakeImage_1: ImagePickerResult = {
            assets: [{
                uri: 'test.jpg',
                width: 0,
                height: 0
            }],
            canceled: false,
        }
        const fakeImage_2: ImagePickerResult = {
            assets: [{
                uri: 'test.jpg',
                width: 0,
                height: 0
            }],
            canceled: false,
        }
        const fakeMatchingImage: ImagePickerResult = {
            assets: [{
                uri: 'test.jpg',
                width: 0,
                height: 0
            }],
            canceled: false,
        }

        let success: boolean = false;

        await act(async () => {
            success = await result.current.createGame({"data": "beans"}, fakeMatchingImage, fakeImage_1, fakeImage_2);
        });

        expect(API.multiple_image_post).toHaveBeenCalledWith('/games/matches/', {"data": "beans"}, [
            {label: 'matching_image', file: fakeMatchingImage},
            {label: 'non_matching_image_1', file: fakeImage_1},
            {label: 'non_matching_image_2', file: fakeImage_2},
        ]);

        expect(success).toBeTruthy();
        expect(result.current.loading).toBeFalsy();
        expect(result.current.error).toBeNull();
    });

    it('Should return False if the game is not created', async () => {
        // Mock the API response
        (API.multiple_image_post as jest.Mock).mockResolvedValue(null);

        const {result} = renderHook(() => useGame());

        const fakeImage_1: ImagePickerResult = {
            assets: [],
            canceled: false,
        }
        const fakeImage_2: ImagePickerResult = {
            assets: [{
                uri: 'test.jpg',
                width: 0,
                height: 0
            }],
            canceled: false,
        }
        const fakeMatchingImage: ImagePickerResult = {
            assets: [{
                uri: 'test.jpg',
                width: 0,
                height: 0
            }],
            canceled: false,
        }

        let success: boolean = false;

        await act(async () => {
            success = await result.current.createGame({"data": "beans"}, fakeMatchingImage, fakeImage_1, fakeImage_2);
        });

        expect(success).toBeFalsy();
        expect(result.current.loading).toBeFalsy();
        expect(result.current.error).toBe('An error occurred while creating the game');
    });
});

