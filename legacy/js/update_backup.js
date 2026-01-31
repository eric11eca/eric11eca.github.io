const dataCache = {};

async function fetchData(url) {
  if (dataCache[url]) {
    return dataCache[url];
  }
  const response = await fetch(url);
  const data = await response.json();
  dataCache[url] = data;
  return data;
}

function createListItem(item, format) {
  const li = document.createElement("li");
  let content = format(item);

  if (item.links) {
    item.links.forEach(link => {
      content = content.replace(link.text, `<a href="${link.url}" target="_blank">${link.text}</a>`);
    });
  }

  li.innerHTML = content;
  return li;
}

async function initializeApp() {
  try {
    const [newsData, awardsData, serviceData, papersData] = await Promise.all([
      fetchData('../data/news.json'),
      fetchData('../data/awards.json'),
      fetchData('../data/service.json'),
      fetchData('../data/papers.json')
    ]);

    const newsItems = document.getElementById("news-items");
    const newsItemsOld = document.getElementById("news-items-old");

    if (newsItems && newsItemsOld) {
      const newsFragment = document.createDocumentFragment();
      const oldNewsFragment = document.createDocumentFragment();

      newsData.newsItems.forEach(item => {
        newsFragment.appendChild(createListItem(item, (i) => `<strong>[${i.date}]</strong>: ${i.content}`));
      });

      newsData.oldNewsItems.forEach(item => {
        oldNewsFragment.appendChild(createListItem(item, (i) => `<strong>[${i.date}]</strong>: ${i.content}`));
      });

      newsItems.innerHTML = "";
      newsItemsOld.innerHTML = "";
      newsItems.appendChild(newsFragment);
      newsItemsOld.appendChild(oldNewsFragment);
    }

    const awardItems = document.getElementById('award-items');
    if (awardItems) {
      const fragment = document.createDocumentFragment();
      awardsData.forEach(item => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<strong>${item.name}</strong><br><a href="${item.url}" target="_blank">${item.event}</a>`;
        fragment.appendChild(listItem);
      });
      awardItems.appendChild(fragment);
    }

    const serviceItems = document.getElementById('service-items');
    if (serviceItems) {
      const fragment = document.createDocumentFragment();
      serviceData.forEach(item => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<a href="${item.url}" target="_blank">${item.conference}</a>: ${item.role}, ${item.reviews}`;
        fragment.appendChild(listItem);
      });
      serviceItems.appendChild(fragment);
    }

    if (document.getElementById('paper-items')) {
      new PaperManager(papersData, 'paper-items');
    }
    if (document.getElementById('highlight-items')) {
      new HighlightsManager(papersData, 'highlight-items');
    }

    const mediaData = await fetchData('../data/media.json');
    const mediaItems = document.getElementById('media-items');
    if (mediaItems) {
      const fragment = document.createDocumentFragment();
      mediaData.forEach(item => {
        fragment.appendChild(createMediaElement(item));
      });
      mediaItems.appendChild(fragment);
    }
  } catch (error) {
    console.error('Error initializing app:', error);
  }
}

function createMediaElement(item) {
  const wrapperDiv = document.createElement('div');
  wrapperDiv.className = 'white-wrapper';

  wrapperDiv.innerHTML = `
    <div class="w-row">
      <div class="column-16 w-col w-col-4 w-col-medium-4">
        <img src="${item.imageSrc}" srcset="${item.imageSrcSet}" height="80%" class="image-9" loading="lazy">
      </div>
      <div class="w-col w-col-8 w-col-medium-8">
        <div class="wf-section">
          <h2 class="heading-15">${item.title}</h2>
        </div>
        <div class="wf-section">
          <div class="post-info">${item.source}</div>
          <div class="post-info"> | </div>
          <div class="post-info">${item.date}</div>
        </div>
        <div class="wf-section">
          <b>Overview</b>: ${item.overview}<br>
          <a href="${item.readMoreLink}" target="_blank" rel="noopener noreferrer">Read more</a>
        </div>
      </div>
    </div>
  `;

  return wrapperDiv;
}

document.addEventListener('DOMContentLoaded', initializeApp);

class BasePaperRenderer {
  createElement(tag, attributes = {}, innerHTML = '') {
    const element = document.createElement(tag);
    for (const [key, value] of Object.entries(attributes)) {
      if (key === 'style' && typeof value === 'object') {
        Object.assign(element.style, value);
      } else {
        element[key] = value;
      }
    }
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
  }

  createImageColumn(item) {
    const imageCol = this.createElement('div', { className: 'column-17 w-col w-col-4' });
    const img = this.createElement('img', {
      src: item.imageSrc,
      srcset: item.imageSrcset,
      alt: '',
      loading: 'lazy',
      width: '2839',
      height: '240',
      className: 'image-9',
    });
    imageCol.appendChild(img);
    imageCol.style.width = '50%';
    return imageCol;
  }

  createLinksSection(item) {
    const linksSection = this.createElement('div', { className: 'wf-section' });
    const links = [
      { link: item.pdfLink, text: 'pdf', className: 'label label-primary' },
      { link: item.codeLink, text: 'code', className: 'label label-code' },
      { link: item.videoLink, text: 'video', className: 'label label-video' },
      { link: item.conferenceLink, text: item.conferenceLabel, className: 'label label-conference' },
      { link: item.journalLink, text: item.journalLabel, className: 'label label-journal' },
      { link: item.workshopLink, text: item.workshopLabel, className: 'label label-workshop' },
      { link: item.awardLink, text: item.awardLabel, className: 'label label-best' }
    ];

    const fragment = document.createDocumentFragment();
    links.forEach(({ link, text, className }) => {
      if (link) {
        const anchor = this.createElement('a', { href: link, target: '_blank', className: 'label_link' });
        const span = this.createElement('span', { className: `post-info ${className}` }, text);
        anchor.appendChild(span);
        fragment.appendChild(anchor);

        const mobileMask = this.createElement('div', { className: 'post-info mobile-mask' }, '|');
        fragment.appendChild(mobileMask);
      }
    });

    if (fragment.lastChild) {
      fragment.removeChild(fragment.lastChild);
    }

    linksSection.appendChild(fragment);
    return linksSection;
  }

  createInfoSection(item) {
    const infoSection = this.createElement('div', {
      className: 'wf-section',
      style: { paddingRight: '20px' }
    });
    const authorsInfo = this.createElement('div', { className: 'post-info-noncaps' });

    const publication = `<br>✍️ <i>${item.authors.replace('Zeming Chen', '<b>Zeming Chen</b>')}</i><br><br>📚 <font size="+0">${item.publicationInfo}</font><br>`;
    authorsInfo.innerHTML = publication;
    infoSection.appendChild(authorsInfo);

    return infoSection;
  }

  addPresentationType(parent, item) {
    if (item.presentationType) {
      const presentationTypeSection = this.createElement('div', {},
        `<font color="firebrick"><h4><b>${item.presentationType}</b></h4></font>`);
      parent.appendChild(presentationTypeSection);
    }

    if (item.mediaInfo && item.mediaLink) {
      const mediaInfos = Array.isArray(item.mediaInfo) ? item.mediaInfo : [item.mediaInfo];
      const mediaLinks = Array.isArray(item.mediaLink) ? item.mediaLink : [item.mediaLink];

      mediaInfos.forEach((info, index) => {
        const link = mediaLinks[index] || mediaLinks[0];
        const mediaSection = this.createElement('div', {},
          `<font color="firebrick"><h4><b><a target="_blank" href="${link}">${info}</a></b></h4></font>`);
        parent.appendChild(mediaSection);
      });
    }
  }

  createHeaderSection(item) {
    const headerSection = this.createElement('div', { className: 'wf-section' });
    const titleSection = this.createElement('div', { className: 'wf-section' },
      `<h2 class="heading-15"><strong>${item.title}</strong></h2>`);
    const linksSection = this.createLinksSection(item);

    headerSection.appendChild(titleSection);
    headerSection.appendChild(linksSection);
    return headerSection;
  }

  createDetailsColumn(item) {
    const contentCol = this.createElement('div', { className: 'w-col w-col-8' });
    const infoSection = this.createInfoSection(item);
    const summary = this.createElement('details', {},
      `<summary><strong>TL;DR</strong></summary><p>${item.summary}</p>`);

    contentCol.appendChild(infoSection);
    contentCol.appendChild(summary);
    contentCol.appendChild(this.createElement('hr'));
    this.addPresentationType(contentCol, item);

    if (contentCol.lastChild && contentCol.lastChild.tagName === 'HR') {
      contentCol.removeChild(contentCol.lastChild);
    }
    return contentCol;
  }

  createPaperElement(item) {
    const whiteWrapper = this.createElement('div', {
      className: 'white-wrapper',
      style: { paddingLeft: '25px' }
    });
    const headerSection = this.createHeaderSection(item);
    const rowDiv = this.createElement('div', {
      className: 'w-row',
      style: { display: 'flex', alignItems: 'center' }
    });

    rowDiv.appendChild(this.createImageColumn(item));
    rowDiv.appendChild(this.createDetailsColumn(item));
    whiteWrapper.appendChild(headerSection);
    whiteWrapper.appendChild(rowDiv);

    return whiteWrapper;
  }
}

class PaperManager extends BasePaperRenderer {
  constructor(data, containerId) {
    super();
    this.data = data;
    this.container = document.getElementById(containerId);
    this.sections = {
      all: null,
      preprints: null,
      conferences: null,
      journals: null,
      workshops: null,
    };
    this.initialize();
  }

  initialize() {
    try {
      this.createButtonBar();
      this.createSections();
      this.populateSections(this.data);
      this.showSection('all');
    } catch (error) {
      console.error('Error loading JSON:', error);
    }
  }

  createButtonBar() {
    const buttonBar = this.createElement('div', {
      id: 'button-bar',
      style: { marginBottom: '20px', justifyContent: 'center', textAlign: 'center' }
    });
    this.container.appendChild(buttonBar);

    const buttons = [
      { text: 'All', section: 'all' },
      { text: 'Preprints', section: 'preprints-section' },
      { text: 'Conferences', section: 'conferences-section' },
      { text: 'Journals', section: 'journals-section' },
      { text: 'Workshops', section: 'workshops-section' }
    ];

    buttons.forEach(({ text, section }) => {
      const button = this.createElement('button', { className: 'w-button' }, text);
      button.style.borderRadius = '5px';
      button.style.marginRight = '10px';
      button.addEventListener('click', () => this.showSection(section));
      buttonBar.appendChild(button);
    });
  }

  createSections() {
    this.sections.preprints = this.createSection('preprints-section', 'Preprints');
    this.sections.conferences = this.createSection('conferences-section', 'Conferences');
    this.sections.journals = this.createSection('journals-section', 'Journals');
    this.sections.workshops = this.createSection('workshops-section', 'Workshops');
  }

  createSection(id, title) {
    const section = this.createElement('div', { id });
    section.innerHTML = `<h2>${title}</h2>`;
    this.container.appendChild(section);
    return section;
  }

  populateSections(data) {
    const fragments = {
      preprints: document.createDocumentFragment(),
      conferences: document.createDocumentFragment(),
      journals: document.createDocumentFragment(),
      workshops: document.createDocumentFragment()
    };

    data.forEach(item => {
      const paperElement = this.createPaperElement(item);

      if (item.conferenceLink) {
        fragments.conferences.appendChild(paperElement);
      } else if (item.journalLink) {
        fragments.journals.appendChild(paperElement);
      } else if (item.workshopLink) {
        fragments.workshops.appendChild(paperElement);
      } else {
        fragments.preprints.appendChild(paperElement);
      }
    });

    this.sections.conferences.appendChild(fragments.conferences);
    this.sections.journals.appendChild(fragments.journals);
    this.sections.workshops.appendChild(fragments.workshops);
    this.sections.preprints.appendChild(fragments.preprints);
  }

  showSection(sectionId) {
    Object.keys(this.sections).forEach(id => {
      if (id === 'all') return;
      this.sections[id].style.display = (sectionId === 'all' || id === sectionId.replace('-section', '')) ? 'block' : 'none';
    });
  }
}

class HighlightsManager extends BasePaperRenderer {
  constructor(data, containerId) {
    super();
    this.data = data;
    this.container = document.getElementById(containerId);
    this.highlightPapers = {
      'Reasoning as Test-Time Learning': [
        'PERK: Long-Context Reasoning as Parameter-Efficient Test-Time Learning',
        'RECKONING: Reasoning through Dynamic Knowledge Encoding'
      ],
      'Large-Scale AI Development': [
        'MEDITRON-70B: Scaling Medical Pretraining for Large Language Models',
        'MEDITRON: Open Medical Foundation Models Adapted for Clinical Practice',
        'INCLUDE: Evaluating Multilingual Language Understanding with Regional Knowledge'
      ]
    };
    this.initialize();
  }

  initialize() {
    try {
      this.populateHighlights(this.data);
    } catch (error) {
      console.error('Error loading highlights:', error);
    }
  }

  populateHighlights(allPapers) {
    const fragment = document.createDocumentFragment();

    Object.keys(this.highlightPapers).forEach(sectionTitle => {
      const sectionHeading = this.createElement('h2', {
        style: { marginTop: '30px', marginBottom: '20px', textAlign: 'left' }
      }, `<strong>${sectionTitle}</strong>`);
      fragment.appendChild(sectionHeading);

      const paperTitles = this.highlightPapers[sectionTitle];
      const papers = allPapers.filter(paper => paperTitles.includes(paper.title));

      papers.forEach(paper => {
        fragment.appendChild(this.createPaperElement(paper));
      });
    });

    this.container.appendChild(fragment);
  }
}