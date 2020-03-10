import * as yup from 'yup';

const schema = {
  store: {
    body: yup.object().shape({
      name: yup.string().required(),
      templateId: yup.number().required(),
      subject: yup.string().required(),
      variables: yup.object().shape({
        default: yup.object().required(),
        contact: yup.object(),
      }),
      contacts: yup
        .array()
        .of(yup.number())
        .required(),
    }),
  },
  show: {
    params: yup.object().shape({
      id: yup.number().required(),
    }),
  },
};

export default schema;
