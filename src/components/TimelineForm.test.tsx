import { act, fireEvent, render, screen } from '@testing-library/react'
import TimelineForm from './TimelineForm'
import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import '@testing-library/jest-dom'
import fetchMock from 'jest-fetch-mock';

global.fetch = fetchMock as any;

const queryClient = new QueryClient();

describe('TimelineForm', () => {

    it('does not submit when form is empty', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ /* your expected response here */ }));

        await act(async () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <TimelineForm />
                </QueryClientProvider>
            );
        });

        await act(async () => {
            const submitBtn = screen.getByRole('button', { name: 'Enviar' });
            fireEvent.click(submitBtn);
        });

        expect(fetchMock).not.toHaveBeenCalledTimes(2);

        fetchMock.resetMocks();
    });

    // more test

    afterEach(() => {
        fetchMock.resetMocks();
    });
})