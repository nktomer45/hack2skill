import { useState, useMemo, useCallback } from "react";
import {
  ChevronUp,
  ChevronDown,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ProductTable = ({
  products,
  currentPage,
  totalPages,
  onPageChange,
  onAddToCart,
  onEditProduct,
  onDeleteProduct,
  onSort,
  sortField,
  sortDirection,
}) => {
  const [draggedColumn, setDraggedColumn] = useState(null);
  const [columnOrder, setColumnOrder] = useState([
    "id",
    "image",
    "name",
    "category",
    "price",
    "stock",
    "status",
    "actions",
  ]);

  // Column definitions with drag and drop support
  const columns = {
    id: { label: "ID", sortable: true, width: "w-16" },
    image: { label: "Image", sortable: false, width: "w-20" },
    name: { label: "Product Name", sortable: true, width: "w-64" },
    category: { label: "Category", sortable: true, width: "w-32" },
    price: { label: "Price", sortable: true, width: "w-24" },
    stock: { label: "Stock", sortable: true, width: "w-20" },
    status: { label: "Status", sortable: true, width: "w-28" },
    actions: { label: "Actions", sortable: false, width: "w-32 md:w-48" },
  };

  // Handle drag and drop for column reordering
  const handleDragStart = (e, columnKey) => {
    setDraggedColumn(columnKey);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetColumnKey) => {
    e.preventDefault();

    if (draggedColumn && draggedColumn !== targetColumnKey) {
      const newOrder = [...columnOrder];
      const draggedIndex = newOrder.indexOf(draggedColumn);
      const targetIndex = newOrder.indexOf(targetColumnKey);

      // Remove dragged column and insert at target position
      newOrder.splice(draggedIndex, 1);
      newOrder.splice(targetIndex, 0, draggedColumn);

      setColumnOrder(newOrder);
    }

    setDraggedColumn(null);
  };

  const handleDragEnd = () => {
    setDraggedColumn(null);
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const variants = {
      "In Stock": "bg-success-light text-success border-success/20",
      "Low Stock": "bg-warning-light text-warning border-warning/20",
      "Out of Stock":
        "bg-destructive/10 text-destructive border-destructive/20",
    };

    return <Badge className={`${variants[status]} border`}>{status}</Badge>;
  };

  // Render table cell content
  const renderCell = (product, columnKey) => {
    switch (columnKey) {
      case "id":
        return (
          <span className="font-mono text-sm text-muted-foreground">
            #{product.id}
          </span>
        );

      case "image":
        return (
          <img
            src={product.image}
            alt={product.name}
            className="w-12 h-12 rounded-lg object-cover shadow-sm"
            loading="lazy"
          />
        );

      case "name":
        return (
          <div>
            <p className="font-medium text-foreground">{product.name}</p>
            <p className="text-xs text-muted-foreground truncate max-w-48">
              {product.description}
            </p>
          </div>
        );

      case "category":
        return (
          <Badge variant="secondary" className="bg-secondary/50">
            {product.category}
          </Badge>
        );

      case "price":
        return (
          <span className="font-semibold text-foreground">
            ${product.price}
          </span>
        );

      case "stock":
        return (
          <span
            className={`font-medium ${
              product.stock > 20
                ? "text-success"
                : product.stock > 0
                ? "text-warning"
                : "text-destructive"
            }`}
          >
            {product.stock}
          </span>
        );

      case "status":
        return <StatusBadge status={product.status} />;

      case "actions":
        return (
          <div className="flex flex-col md:flex-row items-stretch md:items-center space-y-1 md:space-y-0 md:space-x-1 min-w-[120px] md:min-w-[200px]">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddToCart(product)}
              className="h-9 md:h-8 px-3 text-xs whitespace-nowrap text-black border border-gray-300 hover:border-gray-300 hover:bg-none hover:text-black"
              disabled={product.stock === 0}
            >
              Add to Cart
            </Button>

            <div className="flex items-center space-x-1 justify-center md:justify-start">
              {/* <Button
                variant="ghost"
                size="sm"
                className="h-9 md:h-8 w-9 md:w-8 p-0 hover:bg-none hover:text-inherit hover:shadow-none"
              >
                {/* <Eye className="h-4 w-4" /> */}
              {/* </Button> */}

              <Button
                variant="ghost"
                size="sm"
                className="h-9 md:h-8 w-9 md:w-8 p-0 hover:bg-none hover:text-inherit hover:shadow-none"
                onClick={() => onEditProduct(product)}
              >
                <Edit className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-9 md:h-8 w-9 md:w-8 p-0 text-destructive hover:bg-none hover:text-destructive hover:shadow-none"
                onClick={() => onDeleteProduct(product)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisible = 5;
    const halfVisible = Math.floor(maxVisible / 2);

    let start = Math.max(1, currentPage - halfVisible);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="card-dashboard rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="table-header">
            <tr>
              {columnOrder.map((columnKey) => {
                const column = columns[columnKey];
                return (
                  <th
                    key={columnKey}
                    className={`px-4 py-3 text-left text-sm font-medium ${column.width} select-none`}
                    draggable={columnKey !== "actions"}
                    onDragStart={(e) => handleDragStart(e, columnKey)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, columnKey)}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="flex items-center space-x-2">
                      {columnKey !== "actions" && (
                        <GripVertical className="h-4 w-4 text-muted-foreground drag-handle opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                      <span>{column.label}</span>
                      {column.sortable && (
                        <button
                          onClick={() => onSort(columnKey)}
                          className="ml-auto hover:bg-secondary/50 p-1 rounded transition-colors"
                        >
                          {sortField === columnKey ? (
                            sortDirection === "asc" ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )
                          ) : (
                            <div className="h-4 w-4 opacity-30">
                              <ChevronUp className="h-2 w-4" />
                              <ChevronDown className="h-2 w-4 -mt-1" />
                            </div>
                          )}
                        </button>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr
                key={product.id}
                className={`table-row group ${
                  index % 2 === 0 ? "bg-background" : "bg-secondary/20"
                }`}
              >
                {columnOrder.map((columnKey) => (
                  <td key={columnKey} className="px-4 py-3">
                    {renderCell(product, columnKey)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t border-border/40 bg-secondary/20">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            Showing {products.length} results
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <div className="flex items-center space-x-1">
            {pageNumbers.map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "ghost"}
                size="sm"
                onClick={() => onPageChange(page)}
                className={`h-8 w-8 p-0 ${
                  page === currentPage ? "btn-primary" : ""
                }`}
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;
