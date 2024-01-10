import type { NextPage } from 'next';
import { CV } from '../components/CV';
import { CV1 } from '../components/CV1'

const Home: NextPage = () => {
  return (
    <div className="mt-8 md:mt-20 max-w-4xl mx-auto px-6 md:px-10">
      <CV1 />
    </div>
  );
};

export default Home;
