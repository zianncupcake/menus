import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

const GET_MENU = gql`
  query {
  menu(id: "7") {
    id
    label
    state
    startDate
    endDate
  	sections {
      id
      label 
      description
      items {
        id
        type
        label
        description
        price
      }
      }
    }
}

`;

export const useMenuData = () => {
  const { loading, error, data } = useQuery(GET_MENU);

  console.log('GraphQL Query Results:', {
    loading,
    error,
    data
  });

  return { loading, error, data };
};