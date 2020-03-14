import * as yup from 'yup';

const schema = {
  store: {
    body: yup.object().shape({
      contacts: yup
        .array(
          yup.object().shape({
            email: yup
              .string()
              .email()
              .required(),
            name: yup.string(),
            tags: yup.array(yup.string()),
            alternateNames: yup.array(yup.string()).nullable(),
          }),
        )
        .required(),
      tags: yup.array(yup.string()),
    }),
  },
};

export default schema;
