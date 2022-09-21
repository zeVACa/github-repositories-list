const input = document.querySelector('.search-repositories__input');
const suggestionsList = document.querySelector('ul.suggestions-list');
const repositoriesList = document.querySelector('ul.repositories-list');

const debouncedGetRepositories = debounce(getRepositories, 500);

input.addEventListener('input', (e) => debouncedGetRepositories(e.currentTarget.value));

async function getRepositories(inputSearchQuery = '') {
  const response = await fetch(
    `https://api.github.com/search/repositories?q=${inputSearchQuery}&page=1&per_page=5`,
  );
  const data = await response.json();

  if (data?.message === 'Validation Failed') {
    clearSuggestionList();
    return;
  }

  renderSuggestions(data.items);
}

function debounce(fn, debounceTime) {
  let timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, arguments), debounceTime);
  };
}

function renderSuggestions(repositoriesDataList) {
  clearSuggestionList();

  if (repositoriesDataList.length === 0) {
    const li = document.createElement('li');

    li.textContent = 'По вашему запросу не было ничего найдено';

    suggestionsList.appendChild(li);

    return;
  }

  repositoriesDataList.forEach((item) => {
    const li = document.createElement('li');

    li.textContent = item.name;
    li.setAttribute('data-id', item.id);

    li.addEventListener('click', (e) => {
      clearSuggestionList();
      input.value = '';

      appendRepositoryToList(item.name, item.owner.login, item.stargazers_count);
    });

    li.classList.add('suggestions-list__item');

    suggestionsList.appendChild(li);
  });
}

repositoriesList.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') {
    e.target.closest('li').remove();
  }
});

function appendRepositoryToList(name, owner, stars) {
  const li = document.createElement('li');
  const div = document.createElement('div');
  const deleteButton = document.createElement('button');

  for (let i = 0; i < arguments.length; i++) {
    const paragraph = document.createElement('p');

    paragraph.textContent = arguments[i];
    paragraph.classList.add('repositories-list__paragraph');

    div.appendChild(paragraph);
  }

  deleteButton.textContent = '×';
  deleteButton.classList.add('repositories-list__delete-button');

  li.appendChild(div);
  li.appendChild(deleteButton);

  li.classList.add('repositories-list__item');

  repositoriesList.appendChild(li);
}

function clearSuggestionList() {
  while (suggestionsList.firstChild) {
    suggestionsList.firstChild.remove();
  }
}
