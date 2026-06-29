import { Spinner } from './ui/spinner';

export const Loader = () => {
  return (
    <div className="flex  items-center justify-center h-screen">
      <div className="flex items-center gap-4">
        <p className="text-muted-foreground">Loading...</p>
        <Spinner />
      </div>
    </div>
  );
};
