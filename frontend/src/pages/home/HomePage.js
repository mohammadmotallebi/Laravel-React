import { $t } from 'i18n/index';
import { Title } from 'components/Title';

export default function HomePage() {
	
	return (
		<main id="HomePage" className="main-page">
<section className="page-section q-pa-md" >
    <div className="container-fluid">
        <div className="grid ">
            <div className="col comp-grid" >
                <Title title={$t('home')}   titleClass="text-2xl font-bold" subTitleClass="text-sm text-500"       />
            </div>
        </div>
    </div>
</section>
		</main>
	);
}
<style scoped>
</style>
