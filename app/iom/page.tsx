'use client'
import React, {useState} from 'react';
import AdminPanel from "@/components/AdminPanel";
import ProductManagement from "@/components/iomProduct/ProductManagement";
import VariantManagement from "@/components/iomVariant/VariantManagement";
import CategoryManagement from "@/components/iomCategory/CategoryManagement";
import SpecialManagement from "@/components/iomSpecial/SpecialManagement";
import OrderManagement from "@/components/iomOrder/OrderManagement";
import PendingOrders from "@/components/iomPendingOrder/PendingOrders";
import OpenDisputes from "@/components/iomIssueOrder/OpenDisputes";

function Page() {
    const [activeView, setActiveView] = useState("")

    return (
        <div className="flex gap-4pt-4 pb-10 ">
            <AdminPanel setActiveView={setActiveView}/>

            <div id="iom-content" className="flex flex-1">
                {(() => {
                    switch (activeView) {
                        case "productManagement":
                            return <ProductManagement />;
                        case "variantManagement":
                            return <VariantManagement />;
                        case "categoryManagement":
                            return <CategoryManagement />;
                        case "specialManagement":
                            return <SpecialManagement />;
                        case "orderManagement":
                            return <OrderManagement />;
                        case "pendingOrders":
                            return <PendingOrders />;
                        case "openDisputes":
                            return <OpenDisputes />;
                        default:
                            return <ProductManagement />;
                    }
                })()}
            </div>
        </div>
    );
}

export default Page;