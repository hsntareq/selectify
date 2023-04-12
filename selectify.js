
Element.prototype.setAttributes = function (attrs) {
	for (var key in attrs) {
		this.setAttribute(key, attrs[key]);
	}
}

const countHiddenItems = (list) => {
	let result = 0;
	list.forEach((item) => {
		if (item.style.display !== 'none') {
			result += 1;
		}
	});
	return result;
};


function filterList(input, ul) {
	var filter, ul, li, a, i, txtValue;

	filter = input.value.toUpperCase();
	li = ul.getElementsByTagName('li');

	for (i = 0; i < li.length; i++) {
		txtValue = li[i].textContent || li[i].innerText;

		if (txtValue.toUpperCase().indexOf(filter) > -1) {
			li[i].style.display = "";
		} else {
			li[i].style.display = "none";
		}
	}
}

window.selectify = (selectElementDOM, attr = {}) => {
	let selectElements = document.querySelectorAll(selectElementDOM);
	(() => {
		selectElements.forEach(selectElement => {
			let wrapper, inputElement, searchInput, viewElement, dropdownWrapper, ulElement, liArray, liElement, dropdownShowHide, noItemFound;

			let searchPlaceholder = attr.searchPlaceholder ?? 'Type to search';
			let dropdownHeight = attr.dropdownHeight ?? '200px';
			let viewText = attr.viewText ?? 'Select Here';
			let noItemText = attr.noItemText ?? 'Select Here';

			selectElement.style.display = 'none';
			liArray = [...selectElement].map(option => `<li class="cursor-pointer px-4 py-2 border-t border-gray-300" data-value="${option.value}">${option.text}</li>`);

			wrapper = document.createElement('div');
			wrapper.setAttributes({
				'class': 'select_dropdown w-[220px]',
			});

			selectElement.parentNode.insertBefore(wrapper, selectElement);
			wrapper.appendChild(selectElement);

			ulElement = document.createElement('ul');
			ulElement.setAttributes({
				'class': `flex-1 overflow-scroll max-h-[${dropdownHeight}]`,
			});

			ulElement.insertAdjacentHTML('beforeend', liArray.join(""));
			liElement = ulElement.querySelectorAll('li');

			inputElement = document.createElement('input');
			inputElement.setAttributes({
				'type': 'hidden',
				'name': selectElement.getAttribute('name') ?? ''
			});

			searchInput = document.createElement('input');
			searchInput.setAttributes({
				'class': 'py-2 px-3 w-full focus:ring-0',
				'type': 'text',
				'placeholder': searchPlaceholder,
			});

			selectElement.setAttributes({ 'name': '' })

			dropdownWrapper = document.createElement('div');
			dropdownWrapper.setAttributes({
				'class': 'ring-1 ring-t-0 ring-gray-500 shadow flex flex-col',
				'style': 'display:none'
			})
			dropdownShowHide = dropdownWrapper.style.display;

			viewElement = document.createElement('div');
			viewElement.setAttributes({
				'class': 'ring-1 ring-gray-500 py-2 px-5 cursor-pointer'
			});
			noItemFound = document.createElement('div');
			noItemFound.innerText = noItemText ?? 'No item found!'
			noItemFound.setAttributes({
				'class': 'no_item px-4 py-2 border-t border-gray-300',
				'style': 'display:none'
			});


			viewElement.innerText = viewText ?? "Select One from the list";
			wrapper.insertAdjacentElement('beforeend', viewElement);
			wrapper.insertAdjacentElement('beforeend', inputElement);
			wrapper.insertAdjacentElement('beforeend', dropdownWrapper);
			dropdownWrapper.insertAdjacentElement('beforeend', searchInput);
			dropdownWrapper.insertAdjacentElement('beforeend', ulElement);
			ulElement.insertAdjacentElement('beforeBegin', noItemFound);

			document.addEventListener('click', (e) => {
				isDisplay = 'none';
				if ((e.target.parentNode !== wrapper)) {
					isDisplay = 'none';
					searchInput.value = '';
				} else {
					isDisplay = dropdownShowHide === 'block' ? 'none' : 'block';
					searchInput.addEventListener('click',
						(e) => e.stopPropagation()
					);
					searchInput.value = '';
				}

				dropdownWrapper.style.display = isDisplay;
				searchInput.focus();
			});

			searchInput.addEventListener('keyup', (e) => {
				filterList(searchInput, ulElement);
				if (0 === countHiddenItems(liElement)) {
					noItemFound.style.display = 'block';
				} else {
					noItemFound.style.display = 'none';
				}
			});

			liElement.forEach(liItem => {
				liItem.addEventListener('click', (e) => {
					inputElement.value = liItem.dataset.value;
					viewElement.innerText = liItem.innerText;
					dropdownShowHide = 'none';
					searchInput.value = '';
				})
			})

		});
	})();

}
