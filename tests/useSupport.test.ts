import {act, renderHook} from '@testing-library/react-native';
import { useSupport } from '@/hooks/useSupport';
import API from "@/services/api/api";
import {Article} from "@/services/api/types";

jest.mock('@/services/api/api', () => ({
    get: jest.fn(),
    POST: jest.fn(),
}));

describe('Test getArticles from useSupport', () => {
    it('Should return all support articles', async () => {
        const response : Article[] = [
            {
                uuid: '1',
                title: 'Article 1',
                content: 'Content 1',
                source: 'Source 1',
                source_url: 'https://source1.com',
                created_at: '2021-01-01T00:00:00Z',
                updated_at: '2021-01-01T00:00:00Z',
                category: {
                    uuid: '1',
                    name: 'Category 1',
                    description: 'Description 1',
                    created_at: '2021-01-01T00:00:00Z',
                    updated_at: '2021-01-01T00:00:00Z',
                },
                tags: [
                    "tag1",
                ],
                liked: false,
                likes: 0,
                views: 0,
            },
            {
                uuid: '2',
                title: 'Article 2',
                content: 'Content 2',
                source: 'Source 2',
                source_url: 'https://source2.com',
                created_at: '2021-01-01T00:00:00Z',
                updated_at: '2021-01-01T00:00:00Z',
                category: {
                    uuid: '2',
                    name: 'Category 2',
                    description: 'Description 2',
                    created_at: '2021-01-01T00:00:00Z',
                    updated_at: '2021-01-01T00:00:00Z',
                },
                tags: [
                    "tag2",
                ],
                liked: false,
                likes: 0,
                views: 0,
            }
        ];

        (API.get as jest.Mock).mockResolvedValue(response);

        const { result } = renderHook(() => useSupport());

        await act(async () => {
            const articles = await result.current.getArticles();
            expect(articles).toBe(response);
        });

        expect(API.get).toHaveBeenCalledWith('/support/articles/');
        expect(result.current.error).toBeNull();
        expect(result.current.loading).toBeFalsy();
    });
});

describe('Test getLatestArticle from useSupport', () => {
    it('Should return the latest support article', async () => {
        const response : Article = {
            uuid: '1',
            title: 'Article 1',
            content: 'Content 1',
            source: 'Source 1',
            source_url: 'https://source1.com',
            created_at: '2021-01-01T00:00:00Z',
            updated_at: '2021-01-01T00:00:00Z',
            category: {
                uuid: '1',
                name: 'Category 1',
                description: 'Description 1',
                created_at: '2021-01-01T00:00:00Z',
                updated_at: '2021-01-01T00:00:00Z',
            },
            tags: [
                "tag1",
            ],
            liked: false,
            likes: 0,
            views: 0,
        };

        (API.get as jest.Mock).mockResolvedValue([response]);

        const { result } = renderHook(() => useSupport());

        await act(async () => {
            const article = await result.current.getLatestArticle();
            expect(article).toBe(response);
        });

        expect(API.get).toHaveBeenCalledWith('/support/articles/latest-article/');
        expect(result.current.error).toBeNull();
        expect(result.current.loading).toBeFalsy();
    });
});

describe('Test getArticle from useSupport', () => {
    it('Should return a support article by its uuid', async () => {
        const response : Article = {
            uuid: '1',
            title: 'Article 1',
            content: 'Content 1',
            source: 'Source 1',
            source_url: 'https://source1.com',
            created_at: '2021-01-01T00:00:00Z',
            updated_at: '2021-01-01T00:00:00Z',
            category: {
                uuid: '1',
                name: 'Category 1',
                description: 'Description 1',
                created_at: '2021-01-01T00:00:00Z',
                updated_at: '2021-01-01T00:00:00Z',
            },
            tags: [
                "tag1",
            ],
            liked: false,
            likes: 0,
            views: 0,
        };

        (API.get as jest.Mock).mockResolvedValue(response);

        const { result } = renderHook(() => useSupport());

        await act(async () => {
            const article = await result.current.getArticle('1');
            expect(article).toBe(response);
        });

        expect(API.get).toHaveBeenCalledWith('/support/articles/1/');
        expect(result.current.error).toBeNull();
        expect(result.current.loading).toBeFalsy();
    });
})

describe('Test likeArticle from useSupport', () => {
    it('Should like a support article by its uuid', async () => {
        const response = true;

        (API.POST as jest.Mock).mockResolvedValue(response);

        const { result } = renderHook(() => useSupport());

        await act(async () => {
            const article = await result.current.likeArticle('1');
            expect(article).toBe(response);
        });

        expect(API.POST).toHaveBeenCalledWith('/support/articles/1/like/');
        expect(result.current.error).toBeNull();
        expect(result.current.loading).toBeFalsy();
    });
});

describe('Test unlikeArticle from useSupport', () => {
    it('Should unlike a support article by its uuid', async () => {
        const response = true;

        (API.POST as jest.Mock).mockResolvedValue(response);

        const { result } = renderHook(() => useSupport());

        await act(async () => {
            const article = await result.current.unlikeArticle('1');
            expect(article).toBe(response);
        });

        expect(API.POST).toHaveBeenCalledWith('/support/articles/1/unlike/');
        expect(result.current.error).toBeNull();
        expect(result.current.loading).toBeFalsy();
    });
});

describe('Test getArticlesViewedToday from useSupport', () => {
    it('Should return the number of articles viewed today', async () => {
        const response = {
            articles_viewed_today: 5,
        };

        (API.get as jest.Mock).mockResolvedValue(response);

        const { result } = renderHook(() => useSupport());

        await act(async () => {
            const articles = await result.current.getArticlesViewedToday();
            expect(articles).toBe(response.articles_viewed_today);
        });

        expect(API.get).toHaveBeenCalledWith('/support/articles/viewed-today/');
        expect(result.current.error).toBeNull();
        expect(result.current.loading).toBeFalsy();
    });
});