import { Formik, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { $t } from 'i18n/index';
import { Button } from 'primereact/button';
import { CheckDuplicate } from 'components/CheckDuplicate';
import { InputText } from 'primereact/inputtext';
import { Link } from 'react-router-dom';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Title } from 'components/Title';
import useApp from 'hooks/useApp';
import useAuth from 'hooks/useAuth';

import useAddPage from 'hooks/useAddPage';
const RegisterPage = (props) => {
		const auth = useAuth();
	const app = useApp();
	
	//form validation rules
	const validationSchema = yup.object().shape({
		email: yup.string().email().required().label($t('email'))
	});
	
	//form default values
	const formDefaultValues = {
		email: '', 
	}
	
	//page hook where logics resides
	const pageController =  useAddPage({ props, formDefaultValues, afterSubmit });
	
	// destructure and grab what the page needs
	const { formData, resetForm, handleSubmit, submitForm, pageReady, loading, saving, inputClassName } = pageController;
	
	//event raised after form submit
	function afterSubmit(response){
		app.flashMsg(props.msgTitle, props.msgAfterSave);
		resetForm();
		const nextPage = response.nextpage || '/home';
		if (response.token) {
			auth.login(response.token, false);
			app.navigate(nextPage);
		}
		else{
			app.navigate(nextPage);
		}
	}
	
	// page loading form data from api
	if(loading){
		return (
			<div className="p-3 text-center">
				<ProgressSpinner style={{width:'50px', height:'50px'}} />
			</div>
		);
	}
	
	//page has loaded any required data and ready to render
	if(pageReady){
		return (
<main id="UsersUserregisterPage" className="main-page">
    { (props.showHeader) && 
    <section className="page-section mb-3 mb-3" >
        <div className="container">
            <div className="grid align-items-center">
                { !props.isSubPage && 
                <div className="col-fixed " >
                    <Button onClick={() => app.navigate(-1)} label={$t('')}  className="p-button p-button-text " icon="pi pi-arrow-left"  />
                </div>
                }
                <div className=" col-12 md:col-6 " >
                    <Title title={$t('userRegistration')}   titleClass="text-2xl text-primary font-bold" subTitleClass="text-sm text-500"      separator={false} />
                </div>
                <div className="col-12 md:col-4 comp-grid" >
                    <div className="">
                        <div className="flex align-items-center">
                            <div>{$t('alreadyHaveAnAccount')}</div>
                            <div className="ml-2">
                                <Link to="/">
                                    <Button icon="pi pi-user" label={$t('login')} /> 
                                    </Link>
                                </div>
                            </div>
                        </div>
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
                            <Formik initialValues={formData} validationSchema={validationSchema} onSubmit={(values, actions) =>submitForm(values)}>
                                {(formik) => 
                                <>
                                <Form className={`${!props.isSubPage ? 'card ' : ''}`}>
                                    <div className="grid">
                                        <div className="col-12">
                                            <div className="formgrid grid">
                                                <div className="col-12 md:col-3">
                                                    {$t('email')} *
                                                </div>
                                                <div className="col-12 md:col-9">
                                                    <CheckDuplicate value={formik.values.email} apiPath="components_data/users_email_exist">
                                                    { (checker) => 
                                                    <>
                                                    <InputText name="email" onBlur={checker.check} onChange={formik.handleChange}  value={formik.values.email}   label={$t('email')} type="email" placeholder={$t('enterEmail')}        className={inputClassName(formik?.errors?.email)} />
                                                    <ErrorMessage name="email" component="span" className="p-error" />
                                                    {(!checker.loading && checker.exist) && <small className="p-error">{$t('notAvailable')}</small>}
                                                    {checker.loading && <small className="text-500">Checking...</small> }
                                                    </>
                                                    }
                                                    </CheckDuplicate>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    { props.showFooter && 
                                    <div className="text-center my-3">
                                        <Button onClick={(e) => handleSubmit(e, formik)} className="p-button-primary" type="submit" label={$t('submit')} icon="pi pi-send" loading={saving} />
                                    </div>
                                    }
                                </Form>
                                </>
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

//page props and default values
RegisterPage.defaultProps = {
	primaryKey: 'id',
	pageName: 'users',
	apiPath: 'auth/register',
	routeName: 'usersuserregister',
	submitButtonLabel: $t('submit'),
	formValidationError: $t('formIsInvalid'),
	formValidationMsg: $t('pleaseCompleteTheForm'),
	msgTitle: 'Create Record',
	msgAfterSave: $t('recordAddedSuccessfully'),
	msgBeforeSave: $t(''),
	showHeader: true,
	showFooter: true,
	redirect: true,
	isSubPage: false
}
export default RegisterPage;
