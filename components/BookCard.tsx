
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

const BookCard = (book : Book) => {
    return(
        <div className="bg-slate-100 rounded-xl p-8 flex flex-col w-min border-2 shadow-md shadow-amber-100">
            <p className="text-lg font-medium">#{book.index}</p>
            <img className="max-h-64 max-w-[196px]" src={book.image_url} alt="Book Image" />
            <p>{truncate(book.title, 36)}</p>
            <p className="text-sm font-normal py-1 mt-auto">{book.author}</p>
            <p className="text-xs font-light pb-1">{book.type}</p>
            <div className="flex flex-row">
                <p className="font-semibold">{book.discount_price}</p>
                <p className="line-through text-sm self-end font-light pl-1">{book.real_price}</p>
            </div>
            <p className="text-md pt mt-auto pt-2">Ratings: {book.num_reviews}</p>
        </div>
    )

}

function truncate(str: string, n: number){
    return (str.length > n) ? str.substr(0, n-1) + '...' : str;
  };

export default BookCard