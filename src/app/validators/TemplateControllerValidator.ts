import * as yup from 'yup';

const schema = {
  store: {
    body: yup.object().shape({
      fileKey: yup.string().required(),
      template: yup.object().shape({
        name: yup.string().required(),
        subject: yup.string().required(),
        text: yup.string(),
        variables: yup.array().of(yup.string()),
      }),
    }),
  },
  show: {
    params: yup.object().shape({
      id: yup.number().required(),
    }),
  },
};

export default schema;
