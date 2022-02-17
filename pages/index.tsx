import type { NextPage } from "next";
const axios = require("axios");
const jsdom = require("jsdom");
import Head from "next/head";
import { GetStaticProps } from "next";
import { useEffect, useState } from "react";

import styles from "../styles/Home.module.css";
import BookCard from "../components/BookCard";

const { JSDOM } = jsdom;

type Book = {
  title: string;
  author: string;
  type: string;
  discount_price: string;
  real_price: string;
  num_reviews: string;
  image_url: string;
  index: number;
};

type Props = {
  books: Book[];
};

const returnBookCards = (booksFilteredState: Book[]) => {
 if(booksFilteredState.length == 0){
   let no_books_found: Book = {
     title: "No books found",
     author: "No authors found",
     type: "No type found",
     discount_price: "$00.00",
     real_price: "$00.00",
     num_reviews: "0",
     image_url: "https://cdn.pixabay.com/photo/2021/07/07/22/48/question-mark-6395460_960_720.jpg",
     index: 0
   }
   return <BookCard {...no_books_found} />
 }
  return booksFilteredState.map((booksFilteredState) => {
    return <BookCard key={booksFilteredState.title} {...booksFilteredState} />;
  })

}

const Home: NextPage<Props> = ({ books }: Props) => {

  const [booksFilteredState, setBooksFilteredState ] = useState(books);

  // useEffect(() => {
  //   // returnBookCards(booksFilteredState);
  // }, [booksFilteredState])

  return (
    <div className="">
      <Head>
        <title>Top 20 Book List</title>
        <meta name="description" content="Amazon Top 20 Book List" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-cyan-700">
        <h1 className="text-5xl text-center font-normal mt-10 pt-10 text-white">
          Best Sellers
        </h1>
        <h3 className="text-lg text-center pt-5 pb-10 text-white">
          The most popular books based on sales. Updated daily.
        </h3>
      </div>
      <div className="main-body-container flex flex-row">
        <div className="sidebar w-64 min-h-full border-r-2  border-slate-500 ">
          <h2 className="my-4 ml-2 text-2xl font-semibold">Filters</h2>
          <hr />
          <ul className="m-4">
            <h2 className=" text-xl font-medium">Rating:</h2>
            <li className="transition ease-in-out hover:cursor-pointer hover:bg-slate-100 duration-300 hover:-translate-y-1 hover:scale-105" onClick={() => setBooksFilteredState([...books.filter(book => book.index <5)])}>Top 4</li>
            <li className="transition ease-in-out hover:cursor-pointer hover:bg-slate-100 duration-300 hover:-translate-y-1 hover:scale-105" onClick={() => setBooksFilteredState([...books.filter(book => book.index <9)])}>Top 8</li>
            <li className="transition ease-in-out hover:cursor-pointer hover:bg-slate-100 duration-300 hover:-translate-y-1 hover:scale-105" onClick={() => setBooksFilteredState([...books.filter(book => book.index <13)])}>Top 12</li>
            <li className="transition ease-in-out hover:cursor-pointer hover:bg-slate-100 duration-300 hover:-translate-y-1 hover:scale-105" onClick={() => setBooksFilteredState([...books.filter(book => book.index <17)])}>Top 16</li>
            <li className="transition ease-in-out hover:cursor-pointer hover:bg-slate-100 duration-300 hover:-translate-y-1 hover:scale-105" onClick={() => setBooksFilteredState([...books.filter(book => book.index <20)])}>Top 20</li>
          </ul>
          <hr />
          <ul className="m-4">
            <h2 className=" text-xl font-medium">Cost:</h2>
            <li className="transition ease-in-out hover:cursor-pointer hover:bg-slate-100 duration-300 hover:-translate-y-1 hover:scale-105" onClick={() => setBooksFilteredState([...books.filter(book => book.discount_price < "$1")])}>$0 - $10</li>
            <li className="transition ease-in-out hover:cursor-pointer hover:bg-slate-100 duration-300 hover:-translate-y-1 hover:scale-105" onClick={() => setBooksFilteredState([...books.filter(book => book.discount_price < "$2" && book.discount_price > "$1")])}>$10 - $20</li>
            <li className="transition ease-in-out hover:cursor-pointer hover:bg-slate-100 duration-300 hover:-translate-y-1 hover:scale-105" onClick={() => setBooksFilteredState([...books.filter(book => book.discount_price < "$3" && book.discount_price > "$2")])}>$20 - $30</li>
            <li className="transition ease-in-out hover:cursor-pointer hover:bg-slate-100 duration-300 hover:-translate-y-1 hover:scale-105" onClick={() => setBooksFilteredState([...books.filter(book => book.discount_price > "$3")])}>$30 +</li>
            <li className="transition ease-in-out hover:cursor-pointer hover:bg-slate-100 duration-300 hover:-translate-y-1 hover:scale-105" onClick={() => setBooksFilteredState(books)}>All</li>
          </ul>
          <hr />
        </div>
        <div className="grid grid-cols-4 gap-3 justify-items-center mx-40  shadow-xl shadow-slate-200 py-10 my-10">

          {returnBookCards(booksFilteredState)}

        </div>
      </div>
    </div>
  );
};

function containsAlphaNumeric(str: string) {
  var code, i, len;

  for (i = 0, len = str.length; i < len; i++) {
    code = str.charCodeAt(i);
    if (
      (code > 47 && code < 58) ||
      (code > 64 && code < 91) ||
      (code > 96 && code < 123)
    )
      return true;
  }
  return false;
}

function createBookObj(text_scrape: string[], book_img_url: string, index: number) {
  let book_obj = {};
  book_obj = {
    index: index+1,
    title: text_scrape[0],
    author: text_scrape[1],
    type: text_scrape[2],
    discount_price: text_scrape[3].substring(0, 6),
    real_price: text_scrape[4].substring(0, 6),
    num_reviews: text_scrape[5].substring(1, text_scrape[5].length - 1),
    image_url: book_img_url,
  };
  return book_obj;
}

function bookScraping(dom: any) {
  let text_from_book: string[];
  let book_img_url: string;
  let text_scrape: string[];
  let book_array: Array<{}> = [];

  for (let x = 0; x < 20; x++) {
    text_from_book = dom.window.document
      .getElementById(`acs-product-block-${x}`)
      .textContent.split("\n");
    book_img_url = dom.window.document
      .getElementById(`acs-product-block-${x}`)
      .children.item(0)
      .children.item(0)
      .children.item(1).src;
    text_scrape = text_from_book.filter((text_from_book: string) =>
      containsAlphaNumeric(text_from_book)
    );
    text_scrape.forEach((text_scrape_item, index) => {
      text_scrape[index] = text_scrape_item.trim(); //Remove unnecessary spaces
    });
    book_array.push(createBookObj(text_scrape, book_img_url, x));
  }

  return book_array;
}

export const getStaticProps: GetStaticProps = async () => {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  let res = { data: "" };
  let book_array: Array<{}> = [];
  try {
    res = await axios.get("https://www.amazon.com/b?ie=UTF8&node=17296221011"); // Amazon Top 100 URL
    let dom = new JSDOM(res.data);
    book_array = bookScraping(dom); //Returns a JSON Array of the Top 20 Books
  } catch (error) {
    console.error(error);
  }

  return {
    props: {
      books: book_array,
    },
    revalidate: 43200 //Revalidate the data every 24 hours (keeps our Top 20 List accurate and inline with Amazons List)
  };
};

export default Home;
