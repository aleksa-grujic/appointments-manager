import {Tables} from '@/types/supabase.ts';
import {dateSecondsTo0, getHoursRoundedTo30} from '@/lib/utils.ts';
import {set, subMinutes} from 'date-fns';

type Product = {
    name: string;
    displayName: string;
    price: number;
    duration: number;
    count?: number;
};

const regularPlay: Product = {
    name: 'regular-play',
    displayName: 'Igranje',
    price: 300,
    duration: 1.5,
    count: 1,
};

const specialPlay: Product = {
    name: 'special-play',
    displayName: 'Mini igranje',
    price: 100,
    duration: 0.5,
    count: 1,
};

const regularBabysitting: Product = {
    name: 'regular-babysitting',
    displayName: 'Čuvanje',
    price: 500,
    duration: 1,
};

const TIME_THRESHOLD = 5;

export const calculateTotalHours = (appointment: Tables<'appointments'>, startDate?: Date, endDate?: Date): number => {
    const start = startDate || new Date(appointment.start_time);
    const dateOfAppointment = set(new Date(appointment.start_time), {
        hours: new Date().getHours(),
        minutes: new Date().getMinutes(),
        seconds: 0,
        milliseconds: 0,
    });

    const end = endDate ? subMinutes(endDate, TIME_THRESHOLD) : new Date(appointment.end_time || dateOfAppointment);

    const diff = dateSecondsTo0(end).getTime() - dateSecondsTo0(start).getTime();
    // round to 30 minutes interval but if it's exactly hour round to 1
    return getHoursRoundedTo30(diff);
};

export const calculateProducts = (appointment: Tables<'appointments'>, hours?: number): Product[] => {
    const totalHours = hours || calculateTotalHours(appointment);

    const childCount = Number(appointment.child_count || '1');

    if (appointment.type === 'babysitting') {
        const hours = totalHours <= 1 ? 1 : Math.ceil(totalHours);
        return [
            {
                ...regularBabysitting,
                count: hours * childCount,
            },
        ];
    }
    const products: Product[] = [{...regularPlay, count: childCount}];
    if (totalHours > 1.5) {
        const specialHours = totalHours - regularPlay.duration;
        const specialPlayCount = Math.ceil(specialHours / specialPlay.duration);

        products.push({
            ...specialPlay,
            count: specialPlayCount * childCount,
        });
    }
    return products;
};

export const calculatePrice = (appointment: Tables<'appointments'>, initProducts?: Product[]) => {
    const products = initProducts || calculateProducts(appointment);
    const drinksPrice = appointment.drink_cost ? appointment.drink_cost.reduce((acc, drink) => acc + drink, 0) : 0;
    const productsPrice = products.reduce((acc, product) => acc + product.price * (product.count || 1), 0);
    return (drinksPrice + productsPrice).toFixed(0);
};
