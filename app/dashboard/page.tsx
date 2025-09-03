import Card from "@/components/Card";

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card title="Visitas" value="1200" />
      <Card title="Usuarios Activos" value="320" />
      <Card title="Ventas" value="150" />
    </div>
  );
}
