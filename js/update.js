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


document.addEventListener('DOMContentLoaded', function() {
  fetch('../data/papers.json')
    .then(response => response.json())
    .then(data => {
      let paperItems = document.getElementById('paper-items');

      data.forEach(item => {
        const whiteWrapper = document.createElement('div');
        whiteWrapper.className = 'white-wrapper';

        const rowDiv = document.createElement('div');
        rowDiv.className = 'w-row';

        // Image Column
        const imageCol = document.createElement('div');
        imageCol.className = 'column-17 w-col w-col-4';
        if (item.imageSrc.includes('meditron')) {
          imageCol.style = 'margin-top: 5%;';
        }
        const img = document.createElement('img');
        img.src = item.imageSrc;
        img.srcset = item.imageSrcset;
        img.alt = ''; // Add appropriate alt text for each image
        img.loading = 'lazy';
        img.width = '2839';
        img.height = '240';
        img.className = 'image-9';
        imageCol.appendChild(img);

        // Content Column
        const contentCol = document.createElement('div');
        contentCol.className = 'w-col w-col-8';

        // Title Section
        const titleSection = document.createElement('div');
        titleSection.className = 'wf-section';
        const title = document.createElement('h2');
        title.className = 'heading-15';
        title.textContent = item.title;
        titleSection.appendChild(title);

        // Links Section
        const linksSection = document.createElement('div');
        linksSection.className = 'wf-section';
        const mobileMask = document.createElement('div');
        mobileMask.className = 'post-info mobile-mask';
        mobileMask.textContent = '|';

        // PDF Link
        if (item.pdfLink) {
          const pdfAnchor = document.createElement('a');
          pdfAnchor.href = item.pdfLink;
          pdfAnchor.target = '_blank';
          pdfAnchor.className = 'label_link';
          const pdfSpan = document.createElement('span');
          pdfSpan.className = 'post-info label label-primary';
          pdfSpan.textContent = 'pdf';
          pdfAnchor.appendChild(pdfSpan);
          linksSection.appendChild(pdfAnchor);
        }

        // Code Link
        if (item.codeLink) {
          const codeAnchor = document.createElement('a');
          codeAnchor.href = item.codeLink;
          codeAnchor.target = '_blank';
          codeAnchor.className = 'label_link';
          const codeSpan = document.createElement('span');
          codeSpan.className = 'post-info label label-code';
          codeSpan.textContent = 'code';
          codeAnchor.appendChild(codeSpan);
          linksSection.appendChild(mobileMask);
          linksSection.appendChild(codeAnchor);
        }

        // Video Link
        if (item.videoLink) {
          const videoAnchor = document.createElement('a');
          videoAnchor.href = item.videoLink;
          videoAnchor.target = '_blank';
          videoAnchor.className = 'label_link';
          const videoSpan = document.createElement('span');
          videoSpan.className = 'post-info label label-video';
          videoSpan.textContent = 'video';
          videoAnchor.appendChild(videoSpan);
          linksSection.appendChild(mobileMask.cloneNode(true));
          linksSection.appendChild(videoAnchor);
        }

        // Conference Link
        if (item.conferenceLink) {
          const conferenceAnchor = document.createElement('a');
          conferenceAnchor.href = item.conferenceLink;
          conferenceAnchor.target = '_blank';
          conferenceAnchor.className = 'label_link';
          const conferenceSpan = document.createElement('span');
          conferenceSpan.className = 'post-info label label-conference';
          conferenceSpan.textContent = item.conferenceLabel;
          conferenceAnchor.appendChild(conferenceSpan);
          linksSection.appendChild(mobileMask.cloneNode(true));
          linksSection.appendChild(conferenceAnchor);
        }

        // Workshop Link
        if (item.workshopLink) {
          const workshopAnchor = document.createElement('a');
          workshopAnchor.href = item.workshopLink;
          workshopAnchor.target = '_blank';
          workshopAnchor.className = 'label_link';
          const workshopSpan = document.createElement('span');
          workshopSpan.className = 'post-info label label-workshop';
          workshopSpan.textContent = item.workshopLabel;
          workshopAnchor.appendChild(workshopSpan);
          linksSection.appendChild(mobileMask.cloneNode(true));
          linksSection.appendChild(workshopAnchor);
        }

        // Award Link
        if (item.awardLink) {
          const awardAnchor = document.createElement('a');
          awardAnchor.href = item.awardLink;
          awardAnchor.target = '_blank';
          awardAnchor.className = 'label_link';
          const awardSpan = document.createElement('span');
          awardSpan.className = 'post-info label label-best';
          awardSpan.textContent = item.awardLabel;
          awardAnchor.appendChild(awardSpan);
          linksSection.appendChild(mobileMask.cloneNode(true));
          linksSection.appendChild(awardAnchor);
        }

        // Authors and Publication Info
        const infoSection = document.createElement('div');
        infoSection.className = 'wf-section';
        const authorsInfo = document.createElement('div');
        authorsInfo.className = 'post-info-noncaps';
        authors = `✍️ <i>${item.authors}</i><br>`
        venue = `📚 <font size="+0">${item.publicationInfo}</font><br>`
        publication = `<br>${authors}${venue}<br>`.replace('Zeming Chen', '<b>Zeming Chen</b>');
        authorsInfo.innerHTML = publication;
        infoSection.appendChild(authorsInfo);

        // Summary
        const summary = document.createElement('div');
        summary.innerHTML = `<b>TL;DR: </b> ${item.summary}`;

        // Append all sections to content column
        contentCol.appendChild(titleSection);
        contentCol.appendChild(linksSection);
        contentCol.appendChild(infoSection);
        // Check and add Presentation Type if available
        if (item.presentationType) {
          const presentationTypeSection = document.createElement('div');
          presentationTypeSection.innerHTML = `<font color="firebrick"><h4><b>${item.presentationType}</b></h4></font>`;
          contentCol.appendChild(presentationTypeSection);
        }
        if (item.mediaInfo) {
          const presentationTypeSection = document.createElement('div');
          presentationTypeSection.innerHTML = `<font color="firebrick"><h4><b><a target="_blank" href=${item.mediaLink}>${item.mediaInfo}</a></b></h4></font>`;
          contentCol.appendChild(presentationTypeSection);
        }
        contentCol.appendChild(summary);

        // Append columns to row
        rowDiv.appendChild(imageCol);
        rowDiv.appendChild(contentCol);

        whiteWrapper.appendChild(rowDiv);
        paperItems.appendChild(whiteWrapper);
      });
    })
    .catch(error => console.error('Error loading JSON:', error));
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