import { Tables } from '@/types/supabase.ts';
import { Product } from '@/lib/calculate_price.ts';
import { addMinutes, format } from 'date-fns';
import { Separator } from '@/components/ui/separator.tsx';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion.tsx';

interface Items {
  name: string;
  price: number;
  duration: number;
  childCount: number;
  startTime: Date;
  endTime: Date;
}

export const PriceExplainted = ({
  appointment,
  products,
  startTime,
  endTime,
}: {
  appointment: Tables<'appointments'>;
  products: Product[];
  startTime: Date;
  endTime: Date;
}) => {
  console.log(appointment, products, startTime);

  const productsPerTime = () => {
    const items: Items[] = [];
    products.map((product) => {
      if (product.name === 'regular-play') {
        items.push({
          name: product.displayName,
          price: product.price,
          duration: product.duration,
          childCount: Number(appointment.child_count || '1'),
          startTime: startTime,
          endTime: addMinutes(startTime, product.duration * 60),
        });
      } else if (product.name === 'special-play') {
        const count = (product.count || 1) / Number(appointment.child_count || '1');
        const initStartTime = addMinutes(startTime, products[0].duration * 60);
        for (let i = 0; i < count; i++) {
          const start = i === 0 ? initStartTime : addMinutes(initStartTime, product.duration * i * 60);
          const end = addMinutes(start, product.duration * 60);
          items.push({
            name: product.displayName,
            price: product.price,
            duration: product.duration,
            childCount: Number(appointment.child_count || '1'),
            startTime: start,
            endTime: end,
          });
        }
      }
    });

    return items;
  };

  const items = productsPerTime();

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>Računanje igranja</AccordionTrigger>
        <AccordionContent>
          {items.map((item, index) => (
            <>
              <div className={'space-x-2'}>
                <span key={index} className={'font-light'}>
                  <span className={'font-semibold italic'}>{format(item.startTime, 'HH:mm')}</span> -{' '}
                  <span className={'font-semibold italic'}>
                    {index === items.length - 1 ? format(endTime, 'HH:mm') : format(item.endTime, 'HH:mm')}
                  </span>
                </span>
                <span> | </span>
                <span>
                  {item.price} din
                  {item.childCount > 1 ? ` x ${item.childCount} deteta = ${item.price * item.childCount} din` : ''}
                </span>
              </div>
              <Separator orientation={'horizontal'} className={'mt-1'} />
              {index === items.length - 1 && (
                <p className={'font-light italic font-semibold'}>Preostalo vreme do {format(item.endTime, 'HH:mm')}</p>
              )}
            </>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
