interface CardProps {
  title: string;
  value: string;
}

const Card = ({ title, value }: CardProps) => (
  <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
    <h2 className="text-gray-500">{title}</h2>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export default Card;
