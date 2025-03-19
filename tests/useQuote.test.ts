import {act, renderHook} from '@testing-library/react-native';
import { useQuote } from '@/hooks/useQuote';
import API from "@/services/api/api";
import {Quote} from "@/services/api/types";

// Mock the API module
jest.mock('@/services/api/api', () => ({
    quote: jest.fn(),
}));

describe('Test getQuote from useQuote', () => {
    it('Should retrieve a quote from zenquotes.io', async () => {
        const response: Quote = {
            q: "quote",
            a: "author",
            h: "hash"
        };

        (API.quote as jest.Mock).mockResolvedValue(response);

        const { result } = renderHook(() => useQuote());

        await act(async () => {
            const quote = await result.current.getQuote();
            expect(quote).toBe(response);
        });

        expect(API.quote).toHaveBeenCalled();
        expect(result.current.error).toBeNull();
        expect(result.current.loading).toBeFalsy();
    });
});