// import { InstantSearch, SearchBox, Hits, Hit } from 'react-instantsearch-dom';
// import { algoliasearch } from 'algoliasearch/lite';

// // Hit obyekti uchun type aniqlash
// interface ProductHit {
//   hit: {
//     name: string;
//     price: number;
//     description?: string; // optional property
//     [key: string]: any; // qo'shimcha dynamic propertylar uchun
//   };
// }

// // Algolia client sozlamalari
// const searchClient = algoliasearch(
//   process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
//   process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!
// );

// // Mahsulot ko'rinishi komponenti
// const ProductHit = ({ hit }: ProductHit) => (
//   <div className="product-card">
//     <h3 className="product-title">{hit.name}</h3>
//     <p className="product-price">{hit.price.toLocaleString()} $</p>
//     {hit.description && (
//       <p className="product-description">{hit.description}</p>
//     )}
//   </div>
// );

// // Asosiy search komponenti
// const Search = () => {
//   return (
//     <div className="search-container">
//       <InstantSearch 
//         searchClient={searchClient} 
//         indexName="products"
//       >
//         <SearchBox 
//           className="search-input"
//           translations={{
//             placeholder: 'Mahsulotlarni qidirish...',
//           }}
//         />
//         <Hits 
//           hitComponent={ProductHit} 
//           className="hits-list"
//         />
//       </InstantSearch>
//     </div>
//   );
// };

// export default Search;