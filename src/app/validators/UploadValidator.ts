import * as yup from 'yup';

const schema = {
  params: yup.object().shape({
    type: yup.string().oneOf(['template', 'conctact']),
  }),
};

export default schema;
