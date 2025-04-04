import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

const GET_MENU = gql`
  query {
  menu(id: "9") {
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
  return { loading, error, data };
};