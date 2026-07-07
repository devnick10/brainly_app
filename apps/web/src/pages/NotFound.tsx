import { Button } from '@/components/ui/button';
import { Brain } from 'lucide-react';
import type { FC } from 'react';
import { Link } from 'react-router-dom';

const NotFound: FC = () => {
  return (
    <div className="min-h-screen w-full min-w-full flex flex-col gap-10 items-center justify-center p-4 ">
      <div className="flex gap-2">
        <Brain className="h-6 w-6 text-primary" />
        <span className="text-xl font-bold">Brainly</span>
      </div>
      <div className="flex items-center  gap-4">
        <h1> Page Not Found.</h1>
        <Button className="cursor-pointer" variant={'default'}>
          <Link to={'/'}>Home Page</Link>
        </Button>
      </div>
    </div>
  );
};
export default NotFound;
