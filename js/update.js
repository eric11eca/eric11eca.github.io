// document.addEventListener('DOMContentLoaded', function() {
//   fetch('../data/research.json')
//     .then(response => response.json())
//     .then(data => {
//       let researchContent = document.getElementById("research-content");
//       researchContent.innerHTML = "";

//       data.forEach((item, index) => {
//         // Create wrapper div
//         const wrapperDiv = document.createElement('div');
//         wrapperDiv.className = 'white-wrapper';
//         wrapperDiv.style.marginBottom = '20px';
//         wrapperDiv.style.padding = '20px';
//         wrapperDiv.style.backgroundColor = '#f8f9fa';
//         wrapperDiv.style.borderRadius = '8px';

//         // Create row div
//         const rowDiv = document.createElement('div');
//         rowDiv.className = 'w-row';
//         rowDiv.style.display = 'flex';
//         rowDiv.style.alignItems = 'center';

//         // Create image column
//         const imgCol = document.createElement('div');
//         imgCol.className = 'column-16 w-col w-col-4 w-col-medium-4';
//         const img = document.createElement('img');
//         img.src = item.imageSrc;
//         img.srcset = item.imageSrcset;
//         img.alt = item.title;
//         img.loading = 'lazy';
//         img.height = 200;
//         img.className = 'image-9';
//         img.style.borderRadius = '5px';
//         imgCol.appendChild(img);

//         // Create content column
//         const contentCol = document.createElement('div');
//         contentCol.className = 'w-col w-col-8 w-col-medium-8';

//         // Add title
//         const titleDiv = document.createElement('div');
//         titleDiv.className = 'wf-section';
//         const title = document.createElement('h3');
//         title.className = 'heading-15';
//         title.style.marginBottom = '10px';
//         title.textContent = item.title;
//         titleDiv.appendChild(title);

//         // Add description
//         const descDiv = document.createElement('div');
//         descDiv.style.marginBottom = '15px';
//         descDiv.innerHTML = `<p>${item.description}</p>`;

//         // Add links
//         const linksDiv = document.createElement('div');
//         linksDiv.style.marginBottom = '10px';
//         item.links.forEach(link => {
//           const anchor = document.createElement('a');
//           anchor.href = link.url;
//           anchor.target = '_blank';
//           anchor.className = 'label_link';
//           anchor.style.marginRight = '10px';

//           const span = document.createElement('span');
//           span.className = `post-info label ${link.type === 'code' ? 'label-code' : 'label-primary'}`;
//           span.textContent = link.text;

//           anchor.appendChild(span);
//           linksDiv.appendChild(anchor);
//         });

//         // Add tags
//         if (item.tags && item.tags.length > 0) {
//           const tagsDiv = document.createElement('div');
//           tagsDiv.style.marginTop = '10px';
//           item.tags.forEach(tag => {
//             const tagSpan = document.createElement('span');
//             tagSpan.style.display = 'inline-block';
//             tagSpan.style.marginRight = '8px';
//             tagSpan.style.padding = '4px 10px';
//             tagSpan.style.backgroundColor = '#e9ecef';
//             tagSpan.style.borderRadius = '4px';
//             tagSpan.style.fontSize = '0.85em';
//             tagSpan.textContent = tag;
//             tagsDiv.appendChild(tagSpan);
//           });
//           contentCol.appendChild(titleDiv);
//           contentCol.appendChild(descDiv);
//           contentCol.appendChild(linksDiv);
//           contentCol.appendChild(tagsDiv);
//         } else {
//           contentCol.appendChild(titleDiv);
//           contentCol.appendChild(descDiv);
//           contentCol.appendChild(linksDiv);
//         }

//         // Assemble everything
//         rowDiv.appendChild(imgCol);
//         rowDiv.appendChild(contentCol);
//         wrapperDiv.appendChild(rowDiv);
//         researchContent.appendChild(wrapperDiv);
//       });
//     })
//     .catch((error) => {console.error('Error loading research:', error);});
// });

document.addEventListener('DOMContentLoaded', function() {
  fetch('../data/news.json')
    .then(response => response.json())
    .then(data => {
      let newsItems = document.getElementById("news-items");
      let newsItemsOld = document.getElementById("news-items-old");
      newsItems.innerHTML = "";
      newsItemsOld.innerHTML = "";

      data.newsItems.forEach((item, index) => {
        let li = document.createElement("li");
        let content = item.content;

        // Replace placeholders in content with actual links
        item.links.forEach(link => {
          content = content.replace(link.text, `<a href="${link.url}" target="_blank">${link.text}</a>`);
        });

        // Adding strong tag for date
        li.innerHTML = `<strong>[${item.date}]</strong>: ${content}`;

        newsItems.appendChild(li);
      });

      data.oldNewsItems.forEach((item, index) => {
        let li = document.createElement("li");
        let content = item.content;

        // Replace placeholders in content with actual links
        item.links.forEach(link => {
          content = content.replace(link.text, `<a href="${link.url}" target="_blank">${link.text}</a>`);
        });

        // Adding strong tag for date
        li.innerHTML = `<strong>[${item.date}]</strong>: ${content}`;

        newsItemsOld.appendChild(li);
      });
    })
    .catch((error) => {console.error('Error:', error);});
});

document.addEventListener('DOMContentLoaded', function() {
  fetch('../data/awards.json')
    .then(response => response.json())
    .then(data => {
      let awardItems = document.getElementById('award-items');
      data.forEach(item => {
        console.log(item);
        let listItem = document.createElement('li');
        let content = `<strong>${item.name}</strong><br>${item.event}`;
        content = content.replace(item.event, `<a href="${item.url}" target="_blank">${item.event}</a>`);
        listItem.innerHTML = content;
        awardItems.appendChild(listItem);
      });
    })
    .catch(error => console.error('Error loading JSON:', error));
});

document.addEventListener('DOMContentLoaded', function() {
  fetch('../data/service.json')
    .then(response => response.json())
    .then(data => {
      let awardItems = document.getElementById('service-items');
      data.forEach(item => {
        console.log(item);
        let listItem = document.createElement('li');
        let content = `${item.conference}</strong>: ${item.role}, ${item.reviews}`;
        content = content.replace(item.conference, `<a href="${item.url}" target="_blank">${item.conference}</a>`);
        listItem.innerHTML = content;
        awardItems.appendChild(listItem);
      });
    })
    .catch(error => console.error('Error loading JSON:', error));
});

document.addEventListener('DOMContentLoaded', () => {
  class PaperManager {
    constructor(dataUrl, containerId) {
      this.dataUrl = dataUrl;
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

    async initialize() {
      try {
        const data = await this.fetchData(this.dataUrl);
        this.createButtonBar();
        this.createSections();
        this.populateSections(data);
        this.showSection('all');
      } catch (error) {
        console.error('Error loading JSON:', error);
      }
    }

    async fetchData(url) {
      const response = await fetch(url);
      return response.json();
    }

    createButtonBar() {
      const buttonBar = this.createElement('div', { id: 'button-bar', style: 'margin-bottom: 20px;' });
      buttonBar.style.justifyContent = 'center';
      buttonBar.style.textAlign = 'center';
      this.container.appendChild(buttonBar);

      this.createButton(buttonBar, 'All', () => this.showSection('all'));
      this.createButton(buttonBar, 'Preprints', () => this.showSection('preprints-section'));
      this.createButton(buttonBar, 'Conferences', () => this.showSection('conferences-section'));
      this.createButton(buttonBar, 'Journals', () => this.showSection('journals-section'));
      this.createButton(buttonBar, 'Workshops', () => this.showSection('workshops-section'));
    }

    createButton(parent, text, onClick) {
      const button = this.createElement('button', {}, text);
      button.className = 'w-button';
      button.style.borderRadius = '5px';
      button.style.marginRight = '10px';
      button.addEventListener('click', onClick);
      parent.appendChild(button);
    }

    createSections() {
      this.sections.preprints = this.createSection('preprints-section', 'Preprints');
      this.sections.conferences = this.createSection('conferences-section', 'Conferences');
      this.sections.journals = this.createSection('journals-section', 'Journals');
      this.sections.workshops = this.createSection('workshops-section', 'Workshops');
    }

    // Create a section with a title
    createSection(id, title) {
      const section = this.createElement('div', { id });
      section.innerHTML = `<h2>${title}</h2>`;
      this.container.appendChild(section);
      return section;
    }

    // Populate sections with paper items
    populateSections(data) {
      data.forEach(item => {
        const paperElement = this.createPaperElement(item);

        if (item.conferenceLink) {
          this.sections.conferences.appendChild(paperElement);
        } else if (item.journalLink) {
          this.sections.journals.appendChild(paperElement);
        } else if (item.workshopLink) {
          this.sections.workshops.appendChild(paperElement);
        } else {
          this.sections.preprints.appendChild(paperElement);
        }
      });
    }

    createPaperElement(item) {
      const whiteWrapper = this.createElement('div', { className: 'white-wrapper' });
      const rowDiv = this.createElement('div', { className: 'w-row' });
      rowDiv.style.display = 'flex';
      rowDiv.style.alignItems = 'center';

      const imageCol = this.createImageColumn(item);
      const contentCol = this.createContentColumn(item);

      rowDiv.appendChild(imageCol);
      rowDiv.appendChild(contentCol);
      whiteWrapper.appendChild(rowDiv);

      return whiteWrapper;
    }

    createImageColumn(item) {
      const imageCol = this.createElement('div', { className: 'column-17 w-col w-col-4' });
      const img = this.createElement('img', {
        src: item.imageSrc,
        srcset: item.imageSrcset,
        alt: '', // Add appropriate alt text for each image
        loading: 'lazy',
        width: '2839',
        height: '240',
        className: 'image-9',
      });
      imageCol.appendChild(img);
      return imageCol;
    }

    createContentColumn(item) {
      const contentCol = this.createElement('div', { className: 'w-col w-col-8' });
      const titleSection = this.createElement('div', { className: 'wf-section' }, `<h2 class="heading-15">${item.title}</h2>`);
      const linksSection = this.createLinksSection(item);
      const infoSection = this.createInfoSection(item);
      const summary = this.createElement(
        'details',
        {}, // any attributes, e.g. { open: true }
        `
          <summary><strong>TL;DR</strong></summary>
          <p>${item.summary}</p>
        `
      );

      contentCol.appendChild(titleSection);
      contentCol.appendChild(linksSection);
      contentCol.appendChild(infoSection);
      contentCol.appendChild(summary);
      contentCol.appendChild(this.createElement('hr'));
      this.addPresentationType(contentCol, item);

      // Check if 'hr' is the last child and remove it
      if (contentCol.lastChild.tagName === 'HR') {
        contentCol.removeChild(contentCol.lastChild);
      }
      return contentCol;
    }

    createLinksSection(item) {
      const linksSection = this.createElement('div', { className: 'wf-section' });
      const mobileMask = this.createElement('div', { className: 'post-info mobile-mask' }, '|');

      if (item.pdfLink) {
        this.appendLink(linksSection, item.pdfLink, 'pdf', 'label label-primary');
        linksSection.appendChild(mobileMask);
      }
      if (item.codeLink) {
        this.appendLink(linksSection, item.codeLink, 'code', 'label label-code');
        linksSection.appendChild(mobileMask);
      }
      if (item.videoLink) {
        this.appendLink(linksSection, item.videoLink, 'video', 'label label-video');
        linksSection.appendChild(mobileMask.cloneNode(true));
      }
      if (item.conferenceLink) {
        this.appendLink(linksSection, item.conferenceLink, item.conferenceLabel, 'label label-conference');
        linksSection.appendChild(mobileMask.cloneNode(true));
      }
      if (item.journalLink) {
        this.appendLink(linksSection, item.journalLink, item.journalLabel, 'label label-journal');
        linksSection.appendChild(mobileMask.cloneNode(true));
      }
      if (item.workshopLink) {
        this.appendLink(linksSection, item.workshopLink, item.workshopLabel, 'label label-workshop');
        linksSection.appendChild(mobileMask.cloneNode(true));
      }
      if (item.awardLink) {
        this.appendLink(linksSection, item.awardLink, item.awardLabel, 'label label-best');
        linksSection.appendChild(mobileMask.cloneNode(true));
      }

      linksSection.removeChild(linksSection.lastChild);
      return linksSection;
    }

    appendLink(parent, href, text, className) {
      const anchor = this.createElement('a', { href, target: '_blank', className: 'label_link' });
      const span = this.createElement('span', { className: `post-info ${className}` }, text);
      anchor.appendChild(span);
      parent.appendChild(anchor);
    }

    createInfoSection(item) {
      const infoSection = this.createElement('div', { className: 'wf-section', style: 'padding-right: 20px;' });
      const authorsInfo = this.createElement('div', { className: 'post-info-noncaps' });

      const authors = `✍️ <i>${item.authors}</i><br><br>`;
      const venue = `📚 <font size="+0">${item.publicationInfo}</font>`;
      const publication = `<br>${authors}${venue}<br>`.replace('Zeming Chen', '<b>Zeming Chen</b>');

      authorsInfo.innerHTML = publication;
      infoSection.appendChild(authorsInfo);

      return infoSection;
    }

    addPresentationType(parent, item) {
      if (item.presentationType) {
        const presentationTypeSection = this.createElement('div', {}, `<font color="firebrick"><h4><b>${item.presentationType}</b></h4></font>`);
        parent.appendChild(presentationTypeSection);
      }
      if (item.mediaInfo && item.mediaLink) {
        if (Array.isArray(item.mediaInfo) && Array.isArray(item.mediaLink) && item.mediaInfo.length === item.mediaLink.length) {
          item.mediaInfo.forEach((info, index) => {
            const mediaSection = this.createElement('div', {}, `<font color="firebrick"><h4><b><a target="_blank" href="${item.mediaLink[index]}">${info}</a></b></h4></font>`);
            parent.appendChild(mediaSection);
          });
        } else {
          const mediaSection = this.createElement('div', {}, `<font color="firebrick"><h4><b><a target="_blank" href="${item.mediaLink}">${item.mediaInfo}</a></b></h4></font>`);
          parent.appendChild(mediaSection);
        }
      }
    }

    createElement(tag, attributes = {}, innerHTML = '') {
      const element = document.createElement(tag);
      for (const [key, value] of Object.entries(attributes)) {
        element[key] = value;
      }
      element.innerHTML = innerHTML;
      return element;
    }

    showSection(sectionId) {
      Object.keys(this.sections).forEach(id => {
        if (id === 'all') return; // Skip 'all' key
        this.sections[id].style.display = (sectionId === 'all' || id === sectionId.replace('-section', '')) ? 'block' : 'none';
      });
    }
  }

  new PaperManager('../data/papers.json', 'paper-items');

  // Highlights Manager - Selected Publications by Research Area
  class HighlightsManager {
    constructor(dataUrl, containerId) {
      this.dataUrl = dataUrl;
      this.container = document.getElementById(containerId);
      this.highlightPapers = {
        'Large-Scale AI Development': [
          'MEDITRON-70B: Scaling Medical Pretraining for Large Language Models',
          'MEDITRON: Open Medical Foundation Models Adapted for Clinical Practice',
          'INCLUDE: Evaluating Multilingual Language Understanding with Regional Knowledge'
        ],
        'Reasoning as Test-Time Learning': [
          'PERK: Long-Context Reasoning as Parameter-Efficient Test-Time Learning',
          'RECKONING: Reasoning through Dynamic Knowledge Encoding'
        ]
      };
      this.initialize();
    }

    async initialize() {
      try {
        const data = await this.fetchData(this.dataUrl);
        this.populateHighlights(data);
      } catch (error) {
        console.error('Error loading highlights:', error);
      }
    }

    async fetchData(url) {
      const response = await fetch(url);
      return response.json();
    }

    populateHighlights(allPapers) {
      Object.keys(this.highlightPapers).forEach(sectionTitle => {
        // Create section heading
        const sectionHeading = this.createElement('h2', {
          style: 'margin-top: 30px; margin-bottom: 20px; text-align: left;'
        }, sectionTitle);
        this.container.appendChild(sectionHeading);

        // Filter papers for this section
        const paperTitles = this.highlightPapers[sectionTitle];
        const papers = allPapers.filter(paper => paperTitles.includes(paper.title));

        // Add each paper
        papers.forEach(paper => {
          const paperElement = this.createPaperElement(paper);
          this.container.appendChild(paperElement);
        });
      });
    }

    createPaperElement(item) {
      const whiteWrapper = this.createElement('div', { className: 'white-wrapper' });
      const rowDiv = this.createElement('div', { className: 'w-row' });
      rowDiv.style.display = 'flex';
      rowDiv.style.alignItems = 'center';

      const imageCol = this.createImageColumn(item);
      const contentCol = this.createContentColumn(item);

      rowDiv.appendChild(imageCol);
      rowDiv.appendChild(contentCol);
      whiteWrapper.appendChild(rowDiv);

      return whiteWrapper;
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
      return imageCol;
    }

    createContentColumn(item) {
      const contentCol = this.createElement('div', { className: 'w-col w-col-8' });
      const titleSection = this.createElement('div', { className: 'wf-section' }, `<h2 class="heading-15">${item.title}</h2>`);
      const linksSection = this.createLinksSection(item);
      const infoSection = this.createInfoSection(item);
      const summary = this.createElement(
        'details',
        {},
        `
          <summary><strong>TL;DR</strong></summary>
          <p>${item.summary}</p>
        `
      );

      contentCol.appendChild(titleSection);
      contentCol.appendChild(linksSection);
      contentCol.appendChild(infoSection);
      contentCol.appendChild(summary);
      contentCol.appendChild(this.createElement('hr'));
      this.addPresentationType(contentCol, item);

      if (contentCol.lastChild.tagName === 'HR') {
        contentCol.removeChild(contentCol.lastChild);
      }
      return contentCol;
    }

    createLinksSection(item) {
      const linksSection = this.createElement('div', { className: 'wf-section' });
      const mobileMask = this.createElement('div', { className: 'post-info mobile-mask' }, '|');

      if (item.pdfLink) {
        this.appendLink(linksSection, item.pdfLink, 'pdf', 'label label-primary');
        linksSection.appendChild(mobileMask.cloneNode(true));
      }
      if (item.codeLink) {
        this.appendLink(linksSection, item.codeLink, 'code', 'label label-code');
        linksSection.appendChild(mobileMask.cloneNode(true));
      }
      if (item.videoLink) {
        this.appendLink(linksSection, item.videoLink, 'video', 'label label-video');
        linksSection.appendChild(mobileMask.cloneNode(true));
      }
      if (item.conferenceLink) {
        this.appendLink(linksSection, item.conferenceLink, item.conferenceLabel, 'label label-conference');
        linksSection.appendChild(mobileMask.cloneNode(true));
      }
      if (item.journalLink) {
        this.appendLink(linksSection, item.journalLink, item.journalLabel, 'label label-journal');
        linksSection.appendChild(mobileMask.cloneNode(true));
      }
      if (item.workshopLink) {
        this.appendLink(linksSection, item.workshopLink, item.workshopLabel, 'label label-workshop');
        linksSection.appendChild(mobileMask.cloneNode(true));
      }
      if (item.awardLink) {
        this.appendLink(linksSection, item.awardLink, item.awardLabel, 'label label-best');
        linksSection.appendChild(mobileMask.cloneNode(true));
      }

      if (linksSection.lastChild) {
        linksSection.removeChild(linksSection.lastChild);
      }
      return linksSection;
    }

    appendLink(parent, href, text, className) {
      const anchor = this.createElement('a', { href, target: '_blank', className: 'label_link' });
      const span = this.createElement('span', { className: `post-info ${className}` }, text);
      anchor.appendChild(span);
      parent.appendChild(anchor);
    }

    createInfoSection(item) {
      const infoSection = this.createElement('div', { className: 'wf-section', style: 'padding-right: 20px;' });
      const authorsInfo = this.createElement('div', { className: 'post-info-noncaps' });

      const authors = `✍️ <i>${item.authors}</i><br><br>`;
      const venue = `📚 <font size="+0">${item.publicationInfo}</font>`;
      const publication = `<br>${authors}${venue}<br>`.replace('Zeming Chen', '<b>Zeming Chen</b>');

      authorsInfo.innerHTML = publication;
      infoSection.appendChild(authorsInfo);

      return infoSection;
    }

    addPresentationType(parent, item) {
      if (item.presentationType) {
        const presentationTypeSection = this.createElement('div', {}, `<font color="firebrick"><h4><b>${item.presentationType}</b></h4></font>`);
        parent.appendChild(presentationTypeSection);
      }
      if (item.mediaInfo && item.mediaLink) {
        if (Array.isArray(item.mediaInfo) && Array.isArray(item.mediaLink) && item.mediaInfo.length === item.mediaLink.length) {
          item.mediaInfo.forEach((info, index) => {
            const mediaSection = this.createElement('div', {}, `<font color="firebrick"><h4><b><a target="_blank" href="${item.mediaLink[index]}">${info}</a></b></h4></font>`);
            parent.appendChild(mediaSection);
          });
        } else {
          const mediaSection = this.createElement('div', {}, `<font color="firebrick"><h4><b><a target="_blank" href="${item.mediaLink}">${item.mediaInfo}</a></b></h4></font>`);
          parent.appendChild(mediaSection);
        }
      }
    }

    createElement(tag, attributes = {}, innerHTML = '') {
      const element = document.createElement(tag);
      for (const [key, value] of Object.entries(attributes)) {
        element[key] = value;
      }
      element.innerHTML = innerHTML;
      return element;
    }
  }

  new HighlightsManager('../data/papers.json', 'highlight-items');
});


document.addEventListener('DOMContentLoaded', function() {
  fetch('../data/media.json')
    .then(response => response.json())
    .then(data => {
      let mediaItems = document.getElementById('media-items');
      data.forEach(item => {
        const wrapperDiv = document.createElement('div');
        wrapperDiv.className = 'white-wrapper';

        const rowDiv = document.createElement('div');
        rowDiv.className = 'w-row';

        // Image
        const imgDiv = document.createElement('div');
        imgDiv.className = 'column-16 w-col w-col-4 w-col-medium-4';
        const img = document.createElement('img');
        img.src = item.imageSrc;
        img.srcset = item.imageSrcSet;
        img.height = 240;
        img.className = 'image-9';
        imgDiv.appendChild(img);

        // Content
        const contentDiv = document.createElement('div');
        contentDiv.className = 'w-col w-col-8 w-col-medium-8';

        // Title and Info
        const titleSection = document.createElement('div');
        titleSection.className = 'wf-section';
        const title = document.createElement('h2');
        title.className = 'heading-15';
        title.textContent = item.title;
        titleSection.appendChild(title);

        const infoSection = document.createElement('div');
        infoSection.className = 'wf-section';
        infoSection.innerHTML = `<div class="post-info">${item.source}</div><div class="post-info"> | </div><div class="post-info">${item.date}</div>`;

        // Overview
        const overviewDiv = document.createElement('div');
        overviewDiv.className = 'wf-section';
        overviewDiv.innerHTML = `<b>Overview</b>: ${item.overview}<br><a href="${item.readMoreLink}" target="_blank" rel="noopener noreferrer">Read more</a>`;

        // Append everything
        contentDiv.appendChild(titleSection);
        contentDiv.appendChild(infoSection);
        contentDiv.appendChild(overviewDiv);

        rowDiv.appendChild(imgDiv);
        rowDiv.appendChild(contentDiv);

        wrapperDiv.appendChild(rowDiv);
        mediaItems.appendChild(wrapperDiv);
      });
    }
  )
});