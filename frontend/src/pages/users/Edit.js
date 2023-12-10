import { Formik, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { $t } from 'i18n/index';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { PageRequestError } from 'components/PageRequestError';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Title } from 'components/Title';
import useApp from 'hooks/useApp';

import useEditPage from 'hooks/useEditPage';
const UsersEditPage = (props) => {
		const app = useApp();
	// form validation schema
	const validationSchema = yup.object().shape({
		first_name: yup.string().nullable().label($t('firstName')),
		last_name: yup.string().nullable().label($t('lastName')),
		pic: yup.string().nullable().label($t('pic'))
	});
	// form default values
	const formDefaultValues = {
		first_name: '', 
		last_name: '', 
		pic: '', 
	}
	//where page logics resides
	const pageController = useEditPage({ props, formDefaultValues, afterSubmit });
	//destructure and grab what we need
	const { formData, handleSubmit, submitForm, pageReady, loading, saving, apiRequestError, inputClassName } = pageController
	//Event raised on form submit success
	function afterSubmit(response){
		app.flashMsg(props.msgTitle, props.msgAfterSave);
		if(app.isDialogOpen()){
			app.closeDialogs(); // if page is open as dialog, close dialog
		}
		else if(props.redirect) {
			app.navigate(`/users`);
		}
	}
	// loading form data from api
	if(loading){
		return (
			<div className="p-3 text-center">
				<ProgressSpinner style={{width:'50px', height:'50px'}} />
			</div>
		);
	}
	//display error page 
	if(apiRequestError){
		return (
			<PageRequestError error={apiRequestError} />
		);
	}
	//page is ready when formdata loaded successfully
	if(pageReady){
		return (
<main id="UsersEditPage" className="main-page">
    { (props.showHeader) && 
    <section className="page-section mb-3" >
        <div className="container">
            <div className="grid align-items-center">
                { !props.isSubPage && 
                <div className="col-fixed " >
                    <Button onClick={() => app.navigate(-1)} label={$t('')}  className="p-button p-button-text " icon="pi pi-arrow-left"  />
                </div>
                }
                <div className="col " >
                    <Title title={$t('editUsers')}   titleClass="text-2xl text-primary font-bold" subTitleClass="text-sm text-500"      separator={false} />
                </div>
            </div>
        </div>
    </section>
    }
    <section className="page-section " >
        <div className="container">
            <div className="grid ">
                <div className="md:col-9 sm:col-12 comp-grid" >
                    <div >
                        <Formik
                            initialValues={formData}
                            validationSchema={validationSchema} 
                            onSubmit={(values, actions) => {
                            submitForm(values);
                            }
                            }
                            >
                            { (formik) => {
                            return (
                            <Form className={`${!props.isSubPage ? 'card ' : ''}`}>
                                <div className="grid">
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                {$t('firstName')} 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="first_name"  onChange={formik.handleChange}  value={formik.values.first_name}   label={$t('firstName')} type="text" placeholder={$t('enterFirstName')}        className={inputClassName(formik?.errors?.first_name)} />
                                                <ErrorMessage name="first_name" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                {$t('lastName')} 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="last_name"  onChange={formik.handleChange}  value={formik.values.last_name}   label={$t('lastName')} type="text" placeholder={$t('enterLastName')}        className={inputClassName(formik?.errors?.last_name)} />
                                                <ErrorMessage name="last_name" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="formgrid grid">
                                            <div className="col-12 md:col-3">
                                                {$t('pic')} 
                                            </div>
                                            <div className="col-12 md:col-9">
                                                <InputText name="pic"  onChange={formik.handleChange}  value={formik.values.pic}   label={$t('pic')} type="text" placeholder={$t('enterPic')}        className={inputClassName(formik?.errors?.pic)} />
                                                <ErrorMessage name="pic" component="span" className="p-error" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                { props.showFooter && 
                                <div className="text-center my-3">
                                    <Button onClick={(e) => handleSubmit(e, formik)}  type="submit" label={$t('update')} icon="pi pi-send" loading={saving} />
                                </div>
                                }
                            </Form>
                            );
                            }
                            }
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
		);
	}
}
UsersEditPage.defaultProps = {
	primaryKey: 'id',
	pageName: 'users',
	apiPath: 'users/edit',
	routeName: 'usersedit',
	submitButtonLabel: $t('update'),
	formValidationError: $t('formIsInvalid'),
	formValidationMsg: $t('pleaseCompleteTheForm'),
	msgTitle: 'Update Record',
	msgAfterSave: $t('recordUpdatedSuccessfully'),
	msgBeforeSave: $t(''),
	showHeader: true,
	showFooter: true,
	redirect: true,
	isSubPage: false
}
export default UsersEditPage;
