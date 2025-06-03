// import React, { useState } from "react";
// import PrescriptionForm from "./components/PrescriptionForm";
// import PrescriptionList from "./components/PrescriptionList";

// function App() {
//   const [reload, setReload] = useState(false);
//   const [showHistory, setShowHistory] = useState(false); // toggle for history

//   return (
//     <div className="p-4">
//       <div className="flex justify-end mb-4">
//         <button
//           className="bg-green-900 text-white px-6 py-2 rounded-3xl "
//           onClick={() => setShowHistory(!showHistory)}
//         >
//           {showHistory ? "Back to Form" : "History"}
//         </button>
//       </div>

//       {showHistory ? (
//         <PrescriptionList key={reload} />
//       ) : (
//         <PrescriptionForm onSuccess={() => setReload(!reload)} />
//       )}
//     </div>
//   );
// }

// export default App;

import React, { useState } from "react";
import PrescriptionForm from "./components/PrescriptionForm";
import PrescriptionList from "./components/PrescriptionList";
import AdminPanel from "./components/AdminPanel";
import { IoArrowForwardCircleSharp } from "react-icons/io5";
import { IoArrowBackCircleOutline } from "react-icons/io5";

function App() {
  const [reload, setReload] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogout = () => {
    setIsAdmin(false);
    setShowHistory(false);
  };

  if (!isAdmin) {
    return <AdminPanel onLogin={() => setIsAdmin(true)} />;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <button
          className="bg-green-900 text-white px-6 py-2 rounded-3xl text-xl"
          onClick={() => setShowHistory(!showHistory)}
        >
          {showHistory ? "Back to Form" : "History"}
        </button>

        <button
          onClick={handleLogout}
          className="flex justify-between items-center gap-2 bg-green-900 text-white px-4 py-2 rounded-3xl hover:bg-gray-700 text-xl"
        >
          Log Out
          <div className="text-3xl">
            <IoArrowForwardCircleSharp />
          </div>
        </button>
      </div>

      {showHistory ? (
        <PrescriptionList key={reload} />
      ) : (
        <PrescriptionForm onSuccess={() => setReload(!reload)} />
      )}
    </div>
  );
}

export default App;
