import * as Yup from 'yup'

const AddParagraphsSchema = Yup.object({
    paragraphs: Yup.array().of(
        Yup.object({
            para: Yup.string()
                .required('This field is required')
                .min(5, 'Minimum 5 words required')
                .test('word-count', 'Minimum 5 words required', (value) => {
                    return value.split(' ').length >= 5; // Validate at least 5 words
                }),
        })
    ),
})

export default AddParagraphsSchema