import { useGetDataEndyearQuery } from 'state/api';
import Header from 'components/Header';
import { Box } from '@mui/material';

const Endyear = () => {
  const { data, isLoading } = useGetDataEndyearQuery();

  return (
    <Box m='1.5rem 2.5rem'>
      <Header title='End Year' />
      <div>
        {data || !isLoading ? (
          <div>
            <button onClick={() => console.log(data)}>End Year</button>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </Box>
  );
};

export default Endyear;
