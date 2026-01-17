import { useEffect, useState } from "react";
import { fetchExpenses } from "../services/expenseService";

export default function ExpenseList(){
    const[expenses,setExpenses]=useState([]);
    const[loading,setLoading]=useState(true);
    const[error,setError]=useState(null);

    useEffect(()=>{
        fetchExpenses()
            .then(setExpenses)
            .catch(err=>setError(err.message))
            .finally(()=>setLoading(false))
    },[]);

    if (loading) return <p>Loading expenses...</p>;
    if (error) return <p>Error: {error}</p>;
    return(
        <div>
            <h2>Expenses</h2>
            <ul>
                {expenses.map(exp=>(
                    <li key={exp.id}>
                        {exp.description} - ₹{exp.amount} ({exp.category})
                    </li>
                ))}
            </ul>
        </div>
    )
}