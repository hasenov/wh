export default function initTabs() {
    const faqContainer = document.querySelector('.faq');
    const tabsContainer = document.querySelector('.tabs-faq');

	tabsContainer?.addEventListener('click', function(e) {
		const tab = e.target.closest('.tab-faq')
		if(tab) {
			const index = tab.getAttribute('data-tab-toggle');

			tabsContainer.querySelector('.active')?.classList.remove('active');
			tab.classList.add('active');

			faqContainer.querySelector('.content-faq__block.active')?.classList.remove('active');
			faqContainer.querySelector(`#faqBlock${index}`)?.classList.add('active');
		}
	});
}
