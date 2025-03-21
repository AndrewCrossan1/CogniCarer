import {act, renderHook} from '@testing-library/react-native';
import { useGameStatistics } from '@/hooks/games/useGameStatistics';
import API from "@/services/api/api";

// Mock the API module
jest.mock('@/services/api/api', () => ({
    get: jest.fn(),
    post: jest.fn(),
}));

describe('Test getAverageScore from useGameStatistics', () => {
    it('Should return the average score of a game', async () => {
        // Mock the response of the API
        const response = 85.0;

        (API.get as jest.Mock).mockResolvedValue(response);

        const { result } = renderHook(() => useGameStatistics());

        await act(async () => {
            const averageScore = await result.current.getAverageScore("phony-patient-id");
            expect(averageScore).toBe(response);
        });

        expect(API.get).toHaveBeenCalledWith('/games/attempts/average-score/?uuid=phony-patient-id');
        expect(result.current.error).toBeNull();
        expect(result.current.loading).toBeFalsy();
    });
})

describe('Test getHighestScore from useGameStatistics', () => {
    it('Should return the highest score of a game', async () => {
        const response = 94.0;

        (API.get as jest.Mock).mockResolvedValue(response);

        const { result } = renderHook(() => useGameStatistics());

        await act(async () => {
            const highestScore = await result.current.getHighestScore("phony-patient-id");
            expect(highestScore).toBe(response);
        });

        expect(API.get).toHaveBeenCalledWith('/games/attempts/highest-score/?uuid=phony-patient-id');
        expect(result.current.error).toBeNull();
        expect(result.current.loading).toBeFalsy();
    });
})

describe('Test getUniquePlays from useGameStatistics', () => {
    it('Should return the number of unique plays of a user across all games', async () => {
        const response = 10;

        (API.get as jest.Mock).mockResolvedValue(response);

        const { result } = renderHook(() => useGameStatistics());

        await act(async () => {
            const uniquePlays = await result.current.getUniquePlays("phony-patient-id");
            expect(uniquePlays).toBe(response);
        });

        expect(API.get).toHaveBeenCalledWith('/games/attempts/unique-plays/?uuid=phony-patient-id');
        expect(result.current.error).toBeNull();
        expect(result.current.loading).toBeFalsy();
    });
})

describe('Test getMostPlayedGame from useGameStatistics', () => {
    it('Should return the most played game by a user', async () => {
        const response = {
            match: {
                "uuid": "8cff8435-2535-4d70-b92e-5c834051e4df",
                "title": "Match the Wombat",
                "description": "",
                "person_with_dementia": null,
                "public": true,
                "created_at": "2025-03-10 16:07:24",
                "updated_at": "2025-03-10 16:07:24",
                "round_1_time": 15,
                "round_2_time": 10,
                "round_3_time": 5,
                "matching_image": "https://devweb2024.cis.strath.ac.uk/~fqb22133/media/games/match/wombat.jpg",
                "non_matching_image_1": "https://devweb2024.cis.strath.ac.uk/~fqb22133/media/games/match/koala.jpg",
                "non_matching_image_2": "https://devweb2024.cis.strath.ac.uk/~fqb22133/media/games/match/racoon.jpg",
                "maximum_score": 30,
                "average_score": 22.0,
                "times_played": 6
            },
            patient: "patient name",
            count: 2
        };

        (API.get as jest.Mock).mockResolvedValue(response);

        const { result } = renderHook(() => useGameStatistics());

        await act(async () => {
            const mostPlayedGame = await result.current.getMostPlayedGame("phony-patient-id");
            expect(mostPlayedGame).toBe(response);
        });

        expect(API.get).toHaveBeenCalledWith('/games/attempts/most-played/?uuid=phony-patient-id');
        expect(result.current.error).toBeNull();
        expect(result.current.loading).toBeFalsy();
    });
})

describe('Test getTopAttempts from useGameStatistics', () => {
    it('Should return the top attempts of all patients registered to the user', async () => {
        const response = {
            scores: [67, 23, 45, 78, 90],
            week: "2025-03-10 - 2025-03-17",
        };

        (API.get as jest.Mock).mockResolvedValue(response);

        const { result } = renderHook(() => useGameStatistics());

        await act(async () => {
            const topAttempts = await result.current.getTopAttempts();
            expect(topAttempts).toBe(response);
        });

        expect(API.get).toHaveBeenCalledWith('/games/attempts/weeks-scores/');
        expect(result.current.error).toBeNull();
        expect(result.current.loading).toBeFalsy();
    })
})

describe('Test getAttemptsByGameAndPatient from useGameStatistics', () => {
    it('Should return the attempts of a game by a patient', async () => {
        const response = {
            scores: [67, 23, 45, 78, 90],
            week: "2025-03-10 - 2025-03-17",
        };

        (API.get as jest.Mock).mockResolvedValue(response);

        const { result } = renderHook(() => useGameStatistics());

        await act(async () => {
            const attempts = await result.current.getAttemptsByGameAndPatient("phony-game-id", "phony-patient-id");
            expect(attempts).toBe(response);
        });

        expect(result.current.error).toBeNull();
        expect(result.current.loading).toBeFalsy();
    })
})