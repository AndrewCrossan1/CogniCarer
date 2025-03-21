import {act, renderHook} from '@testing-library/react-native';
import { usePatients } from '@/hooks/patients/usePatients';
import API from "@/services/api/api";
import {ImagePickerResult} from "expo-image-picker";
import {Patient} from "@/services/api/types";

// Mock the API module
jest.mock('@/services/api/api', () => ({
    get: jest.fn(),
    POST: jest.fn(),
    image_post: jest.fn(),
    image_put: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
}));

describe('Test getPatients() from usePatients', () => {
    it('Should return a list of Patients', async () => {
        // Mock the API response
        const response: Patient[] = [
            {
                uuid: '123',
                first_name: 'Test',
                middle_name: 'Test',
                last_name: 'Test',
                date_of_birth: '2021-01-01',
                gender: 'Male',
                relationship: 'Test',
                care_notes: 'Test',
            },
            {
                uuid: '124',
                first_name: 'Test',
                middle_name: 'Test',
                last_name: 'Test',
                date_of_birth: '2021-01-01',
                gender: 'Male',
                relationship: 'Test',
                care_notes: 'Test',
            }
        ];
        (API.get as jest.Mock).mockResolvedValue(response);

        const { result } = renderHook(() => usePatients());

        await act(async () => {
            const patients = await result.current.getPatients();
            expect(patients).toEqual(response);
            expect(patients).toBeInstanceOf(Array);
            expect(patients).toHaveLength(2);
        });

        expect(API.get).toHaveBeenCalledWith('patients/');
        expect(result.current.loading).toBeFalsy();
        expect(result.current.error).toBeNull();
    })
});

describe('Test getPatient() from usePatients', () => {
    it('Should return a single Patient', async () => {
        // Mock the API response
        const response: Patient = {
            uuid: '123',
            first_name: 'Test',
            middle_name: 'Test',
            last_name: 'Test',
            date_of_birth: '2021-01-01',
            gender: 'Male',
            relationship: 'Test',
            care_notes: 'Test',
        };

        (API.get as jest.Mock).mockResolvedValue(response);

        const { result } = renderHook(() => usePatients());

        await act(async () => {
            const patient = await result.current.getPatient('123');
            expect(patient).toEqual(response);
            expect(patient).toBeInstanceOf(Object);
        });

        expect(API.get).toHaveBeenCalledWith('patients/123/');
        expect(result.current.loading).toBeFalsy();
        expect(result.current.error).toBeNull();
    })
});

describe('Test updatePatient() from usePatients', () => {
    it('Should return true if the patient was updated', async () => {
        // Mock the API response
        const response = true;
        (API.put as jest.Mock).mockResolvedValue(response);

        const {result} = renderHook(() => usePatients());

        await act(async () => {
                const valid = await result.current.updatePatient('123', {
                    first_name: 'Test',
                    middle_name: 'Test',
                    last_name: 'Test',
                    date_of_birth: '2021-01-01',
                    relationship: 'Test',
                    gender: 'Male',
                });
                expect(valid).toEqual(response);
                expect(valid).toBe(true);
        });
    });
});

describe('Test createPatient() from usePatients', () => {
    it('Should return true if the patient was created', async () => {
        // Mock the API response
        const response = true;
        (API.POST as jest.Mock).mockResolvedValue(response);

        const {result} = renderHook(() => usePatients());

        await act(async () => {
            const valid = await result.current.createPatient({
                first_name: 'Test',
                middle_name: 'Test',
                last_name: 'Test',
                date_of_birth: '2021-01-01',
                relationship: 'Test',
                gender: 'Male',
            });
            expect(valid).toEqual(response);
            expect(valid).toBe(true);
        });

        // Verify by calling 'patients/' endpoint
        expect(API.POST).toHaveBeenCalledWith('patients/', {
            first_name: 'Test',
            middle_name: 'Test',
            last_name: 'Test',
            date_of_birth: '2021-01-01',
            relationship: 'Test',
            gender: 'Male'
        });

        expect(result.current.loading).toBeFalsy();
        expect(result.current.error).toBeNull();
    });
});

describe('Test createPatient() with image from usePatients', () => {
    it('Should return true if the patient was created', async () => {
        // Mock the API response
        const response = true;
        (API.image_post as jest.Mock).mockResolvedValue(response);

        const {result} = renderHook(() => usePatients());

        const image: ImagePickerResult = {
            assets: [{
                uri: 'test.jpg',
                width: 0,
                height: 0
            }],
            canceled: false,
        }

        await act(async () => {
            const valid = await result.current.createPatient({
                first_name: 'Test',
                middle_name: 'Test',
                last_name: 'Test',
                date_of_birth: '2021-01-01',
                relationship: 'Test',
                gender: 'Male'
            }, image);

            expect(valid).toEqual(response);
            expect(valid).toBe(true);
        })

        expect(result.current.loading).toBeFalsy();
        expect(result.current.error).toBeNull();
    })
})

describe('Test deletePatient() from usePatients', () => {
    it('Should return true if the patient was deleted', async () => {
        (API.delete as jest.Mock).mockResolvedValue(undefined);

        const {result} = renderHook(() => usePatients());

        await act(async () => {
            const valid = await result.current.deletePatient('123');
            expect(valid).toBe(true);
        });

        expect(API.delete).toHaveBeenCalledWith('patients/123/');
        expect(result.current.loading).toBeFalsy();
        expect(result.current.error).toBeNull();
    });
});