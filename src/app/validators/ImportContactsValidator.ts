import * as yup from 'yup';

const schema = {
  store: {
    body: yup.object().shape({
      fileKey: yup.string().required(),
    }),
  },
};

export default schema;
