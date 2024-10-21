// wc-stock-fetcher.js
import { LitElement, html, css } from 'lit';

class StockFetcher extends LitElement {

  static get properties() {
    return {
      dealerId: { type: String, attribute: 'dealer-id' },
      primaryCol: { type: String, attribute: 'primary-col' },
      stockData: { type: Array } // Add stockData as a property
    };
  }

  constructor() {
    super();
    this.dealerId = '';
    this.primaryCol = '';
    this.stockData = []; // Initialize stockData
  }

  static styles = css`
    :host {
      --primaryCol: gray; /* Default color */
    }

    .numberOfStock {
      color: var(--numberStockCol);
    }

    .stockItemsWrapper {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 15px;
    }

    .stockItem {
      background-color: white;
      border: 1px solid #ddd;
    }

    .stockItemHeading {
      font-size: 14px;
      color: white;
      background-color: var(--primaryCol); /* Use custom property */
      margin-block: 0;
      padding: 5px;
    }

    .stockItemImage {
        display: block;
        width: 100%;
    }

    .stockFeatures {
      background-color: white;
      padding: 10px;
    }

    .stockFeatureItem {
      font-size: 12px;
      margin-block: 0;
    }

    strong {
      font-family: var(--fontBold);
    }
  `;

  async connectedCallback() {
    super.connectedCallback();
    await this.fetchDataIfNeeded(); // Fetch data if dealerId is set
  }

  async fetchDataIfNeeded() {
    if (this.dealerId) {
      const baseUrl = 'https://s3.ap-southeast-2.amazonaws.com/stock.publish';
      const url = `${baseUrl}/dealer_${this.dealerId}/stock.json`; // Construct the full URL

      try {
        const data = await this.fetchData(url); // Fetch data using the constructed URL
        this.renderData(data); // Render the fetched data
      } catch (error) {
        this.renderData({ message: error.message }); // Handle errors during fetch
      }
    } else {
      this.renderData({ message: 'Dealer ID not provided.' }); // Handle missing attribute
    }
  }

  async fetchData(url) {
    const response = await fetch(url); // Fetch data from the given URL
    if (!response.ok) {
      throw new Error('Network response was not ok'); // Handle errors
    }
    return await response.json(); // Return the JSON data
  }

  renderData(data) {
    this.stockData = data; // Store fetched data for rendering
    this.requestUpdate(); // Request an update to re-render the component
  }

  createStockItem(stock) {
    return html`
      <div class="stockItem">
        <p class="stockItemHeading">${stock.make} - ${stock.model}</p>
        <img
          class="stockItemImage"
          src="${(Array.isArray(stock.images) && stock.images.length > 0) ? stock.images[0] : 'https://placehold.co/250x167/e1e1e1/bebebe?text=No%20Image&font=lato'}"
          alt="${stock.make} ${stock.model}"
        />
        <div class="stockFeatures">
          ${this.createFeatures(stock)}
        </div>
      </div>
    `;
  }

  createFeatures(stock) {
    const features = [
      { label: 'Transmission', value: stock.transmission || 'N/A' },
      { label: 'Body Type', value: stock.bodyType || 'N/A' },
      { label: 'Color', value: stock.colour || 'N/A' },
      { label: 'Kilometres', value: stock.odometer || 'N/A' },
      { label: 'Engine', value: `${stock.size || 'N/A'} ${stock.sizeOption || ''}` },
      { label: 'Stock №', value: stock.stockNumber || 'N/A' }
    ];

    return features.map(feature => html`
      <p class="stockFeatureItem"><strong>${feature.label}:</strong> ${feature.value}</p>
    `);
  }

  render() {
    return html`
      <h3 class="number-of-stock">${this.stockData.length} Stock Items</h3>
      <div class="stockItemsWrapper">
        ${Array.isArray(this.stockData)
          ? this.stockData.map(stock => this.createStockItem(stock))
          : html`<p>${this.stockData?.message || 'No data available.'}</p>`}
      </div>
    `;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'dealer-id' && newValue) {
      this.dealerId = newValue;
      this.fetchDataIfNeeded(); // Fetch data when dealer-id changes
    } else if (name === 'primary-col') {
      this.primaryCol = newValue;
      this.style.setProperty('--primaryCol', newValue); // Update CSS custom property when primary-col changes
    }
  }
}

// Define the custom element
customElements.define('stock-fetcher', StockFetcher);