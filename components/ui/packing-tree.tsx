"use client";

import React, { useState, useRef, createContext, useContext, useMemo, useCallback, useEffect } from 'react';
import { 
  ChevronRight, 
  Square, 
  CheckSquare, 
  Plus, 
  FilePlus, 
  Pencil, 
  Check, 
  X, 
  Trash2,
  Folder,
  File,
  Briefcase,
  Backpack, 
  Shirt,
  Footprints,
  CreditCard,
  PlugZap,
  Sparkles
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
// Import komponentów Radix / Shadcn UI
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// ─── KOLEKCJE IKON DLA ZASOBÓW ──────────────────────────────────────────────
const BAGGAGE_ICONS = [
  { id: 'backpack', label: 'Plecak', icon: Backpack },
  { id: 'suitcase', label: 'Walizka', icon: Briefcase },
];

const ITEM_ICONS = [
  { id: 'shirt', label: 'Ubrania', icon: Shirt },
  { id: 'footprints', label: 'Obuwie', icon: Footprints },
  { id: 'credit-card', label: 'Dokumenty', icon: CreditCard },
  { id: 'plug-zap', label: 'Elektronika', icon: PlugZap },
  { id: 'sparkles', label: 'Akcesoria', icon: Sparkles },
];

const getAutomaticIconId = (name = "") => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("buty") || lowerName.includes("klapki") || lowerName.includes("adidasy") || lowerName.includes("obuwie")) return 'footprints';
  if (lowerName.includes("koszul") || lowerName.includes("spodn") || lowerName.includes("bluz") || lowerName.includes("skarpet") || lowerName.includes("majt")) return 'shirt';
  if (lowerName.includes("paszport") || lowerName.includes("karta") || lowerName.includes("pienią") || lowerName.includes("portfel") || lowerName.includes("bilet")) return 'credit-card';
  if (lowerName.includes("ładowar") || lowerName.includes("telefon") || lowerName.includes("powerbank") || lowerName.includes("kabel") || lowerName.includes("aparat")) return 'plug-zap';
  return 'sparkles';
};

// ─── KONTEKST STRUKTURY DRZEWA ──────────────────────────────────────────────
const TreeContext = createContext(null);
function useTree() {
  const context = useContext(TreeContext);
  if (!context) throw new Error("Tree components must be used within <FileTree />");
  return context;
}

function HoverHighlight() {
  const { hoverBounds } = useTree();
  return (
    <AnimatePresence>
      {hoverBounds && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, top: hoverBounds.top, left: hoverBounds.left, width: hoverBounds.width, height: hoverBounds.height }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", stiffness: 550, damping: 38 }}
          className="absolute rounded-lg bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200/40 dark:border-zinc-800/40 pointer-events-none z-0"
        />
      )}
    </AnimatePresence>
  );
}

function useHoverTarget() {
  const { rowContainerRef, setHoverBounds } = useTree();
  const ref = useRef(null);

  const onMouseEnter = useCallback(() => {
    if (!ref.current || !rowContainerRef.current) return;
    const containerRect = rowContainerRef.current.getBoundingClientRect();
    const elementRect = ref.current.getBoundingClientRect();

    setHoverBounds({
      top: elementRect.top - containerRect.top,
      left: elementRect.left - containerRect.left,
      width: elementRect.width,
      height: elementRect.height,
    });
  }, [rowContainerRef, setHoverBounds]);

  return { ref, onMouseEnter };
}

// ─── KOMPONENT WĘZŁA (REKURENCYJNY) ──────────────────────────────────────────
function TreeNode({ node, checkedIds, onToggleCheck, onAddItem, onRenameItem, onDeleteItem, onChangeIcon, newlyAddedId, clearNewlyAddedId }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [editName, setEditName] = useState(node.name);
  
  const isChecked = checkedIds.has(node.id);
  const isFolder = node.type === 'folder';
  const { ref, onMouseEnter } = useHoverTarget();
  const inputRef = useRef(null);

  useEffect(() => {
    if (newlyAddedId === node.id) {
      setIsEditing(true);
      clearNewlyAddedId();
    }
  }, [newlyAddedId, node.id, clearNewlyAddedId]);

  useEffect(() => {
    setEditName(node.name);
  }, [node.name]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleAddNewItem = (e, type) => {
    e.stopPropagation();
    const defaultName = type === 'folder' ? 'Nowy bagaż' : 'Nowa rzecz';
    onAddItem(node.id, defaultName, type);
    setIsOpen(true);
  };

  const handleStartRename = (e) => {
    e.stopPropagation();
    setEditName(node.name);
    setIsEditing(true);
  };

  const handleSaveRename = () => {
    if (editName.trim() !== "") {
      if (!isFolder && (!node.iconType || node.iconType === 'file')) {
        const autoIcon = getAutomaticIconId(editName.trim());
        onRenameItem(node.id, editName.trim(), autoIcon);
      } else {
        onRenameItem(node.id, editName.trim());
      }
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSaveRename();
    if (e.key === 'Escape') { setEditName(node.name); setIsEditing(false); }
  };

  const DynamicIcon = useMemo(() => {
    if (isFolder) {
      const match = BAGGAGE_ICONS.find(i => i.id === node.iconType);
      return match ? match.icon : Folder;
    } else {
      const match = ITEM_ICONS.find(i => i.id === node.iconType);
      return match ? match.icon : File;
    }
  }, [isFolder, node.iconType]);

  const availableIcons = isFolder ? BAGGAGE_ICONS : ITEM_ICONS;

  return (
    <div className="select-none relative w-full">
      {/* WIERSZ ELEMENTU */}
      <div 
        ref={ref}
        onMouseEnter={onMouseEnter}
        className="flex items-center justify-between py-1 px-2 rounded-lg group text-zinc-700 dark:text-zinc-300 relative z-10 min-h-[32px] box-border"
      >
        <div className="flex items-center gap-2 flex-1 min-w-0 relative z-10">
          {/* Strzałka rozwijania */}
          <button
            type="button"
            className="w-4 h-4 flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors shrink-0"
            onClick={() => isFolder && setIsOpen(!isOpen)}
          >
            {isFolder && node.children && node.children.length > 0 && (
              <motion.span animate={{ rotate: isOpen ? 90 : 0 }} className="flex items-center justify-center">
                <ChevronRight size={14} />
              </motion.span>
            )}
          </button>

          {/* CHECKBOX */}
          <button type="button" onClick={() => onToggleCheck(node)} className="text-blue-600 hover:scale-105 transition-transform shrink-0">
            {isChecked ? (
              <CheckSquare size={16} className="fill-blue-50 dark:fill-zinc-950 text-blue-600 dark:text-blue-500" />
            ) : (
              <Square size={16} className="text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-400" />
            )}
          </button>

          {/* 🌟 INTEGRACJA SHADCN / RADIX POPOVER 🌟 */}
          <Popover open={showIconPicker} onOpenChange={setShowIconPicker}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="p-1 rounded bg-zinc-50 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer border border-zinc-200/50 dark:border-zinc-800/50 transition-colors shrink-0 flex items-center justify-center"
                title="Zmień ikonę"
                onClick={(e) => e.stopPropagation()}
              >
                <DynamicIcon size={14} className={isChecked ? "text-blue-500" : ""} />
              </button>
            </PopoverTrigger>
            
            {/* PopoverContent renderuje się przez Portal, całkowicie poza drzewem DOM tego wiersza */}
            <PopoverContent 
              side="bottom" 
              align="start" 
              sideOffset={5} 
              className="p-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xl flex flex-row gap-1 w-auto min-w-[100px]"
              onClick={(e) => e.stopPropagation()}
            >
              {availableIcons.map((bi) => {
                const TargetIcon = bi.icon;
                return (
                  <button
                    key={bi.id}
                    type="button"
                    onClick={() => { 
                      onChangeIcon(node.id, bi.id); 
                      setShowIconPicker(false); 
                    }}
                    className={`p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors ${node.iconType === bi.id ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-semibold' : ''}`}
                    title={bi.label}
                  >
                    <TargetIcon size={15} />
                  </button>
                );
              })}
            </PopoverContent>
          </Popover>

          {/* NAZWA / POLE EDYCJI */}
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSaveRename}
              onClick={(e) => e.stopPropagation()}
              className="text-sm px-1.5 py-0.5 bg-white dark:bg-zinc-900 border border-blue-500 rounded outline-none w-full max-w-[240px] text-zinc-900 dark:text-zinc-100"
            />
          ) : (
            <span 
              className={`text-sm cursor-pointer transition-colors truncate ${isChecked ? "text-zinc-400 dark:text-zinc-500 line-through opacity-60" : ""}`} 
              onClick={() => isFolder ? setIsOpen(!isOpen) : onToggleCheck(node)}
            >
              {node.name}
            </span>
          )}
        </div>

        {/* PRZYCISKI PANELU AKCJI */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 ml-2 shrink-0 relative z-20">
          {isEditing ? (
            <>
              <button onClick={handleSaveRename} className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded text-green-600"><Check size={12} /></button>
              <button onClick={() => setIsEditing(false)} className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded text-red-600"><X size={12} /></button>
            </>
          ) : (
            <>
              <button onClick={handleStartRename} title="Zmień nazwę" className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded text-zinc-400 hover:text-zinc-700"><Pencil size={12} /></button>
              {isFolder && (
                <>
                  <button onClick={(e) => handleAddNewItem(e, 'file')} title="Dodaj rzecz" className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded text-zinc-400 hover:text-zinc-700"><FilePlus size={13} /></button>
                  <button onClick={(e) => handleAddNewItem(e, 'folder')} title="Dodaj podsekcję" className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded text-zinc-400 hover:text-zinc-700"><Plus size={13} /></button>
                </>
              )}
              <button onClick={(e) => { e.stopPropagation(); onDeleteItem(node); }} title="Usuń" className="p-1 hover:bg-red-50 dark:hover:bg-red-950/40 rounded text-zinc-400 hover:text-red-600"><Trash2 size={12} /></button>
            </>
          )}
        </div>
      </div>

      {/* REKURENCYJNE RENDEROWANIE DZIECI */}
      <AnimatePresence initial={false}>
        {isFolder && isOpen && node.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 550, damping: 38 }}
            className="ml-3 pl-3 border-l border-zinc-200 dark:border-zinc-800 mt-0.5 visible relative z-10"
          >
            {node.children.map((child) => (
              <TreeNode
                key={child.id}
                node={child}
                checkedIds={checkedIds}
                onToggleCheck={onToggleCheck}
                onAddItem={onAddItem}
                onRenameItem={onRenameItem}
                onDeleteItem={onDeleteItem}
                onChangeIcon={onChangeIcon}
                newlyAddedId={newlyAddedId}
                clearNewlyAddedId={clearNewlyAddedId}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── GŁÓWNY KOMPONENT DRZEWA ──────────────────────────────────────────────────
export default function FileTree({ initialData = [], onSelectionChange }) {
  const safeInitialData = Array.isArray(initialData) ? initialData : [];
  const [treeData, setTreeData] = useState(safeInitialData);
  const [checkedIds, setCheckedIds] = useState(new Set());
  const [hoverBounds, setHoverBounds] = useState(null);
  const [newlyAddedId, setNewlyAddedId] = useState(null);
  const containerRef = useRef(null);
  const rowContainerRef = useRef(null);

  useEffect(() => { 
    if (Array.isArray(initialData)) setTreeData(initialData); 
  }, [initialData]);

  const addItemToTree = useCallback((items, targetId, newItem) => {
    return items.map((item) => {
      if (item.id === targetId) return { ...item, children: item.children ? [...item.children, newItem] : [newItem] };
      if (item.children) return { ...item, children: addItemToTree(item.children, targetId, newItem) };
      return item;
    });
  }, []);

  const updateItemInTree = useCallback((items, targetId, fieldsToUpdate) => {
    return items.map((item) => {
      if (item.id === targetId) return { ...item, ...fieldsToUpdate };
      if (item.children) return { ...item, children: updateItemInTree(item.children, targetId, fieldsToUpdate) };
      return item;
    });
  }, []);

  const removeItemFromTree = useCallback((items, targetId) => {
    const filtered = items.filter((item) => item.id !== targetId);
    return filtered.map((item) => item.children ? { ...item, children: removeItemFromTree(item.children, targetId) } : item);
  }, []);

  const handleAddItem = useCallback((targetFolderId, name, type) => {
    const generatedId = crypto.randomUUID();
    const defaultIconId = type === 'folder' ? 'backpack' : getAutomaticIconId(name);

    const newItem = { 
      id: generatedId, 
      name, 
      type, 
      iconType: defaultIconId, 
      children: type === 'folder' ? [] : undefined 
    };
    setNewlyAddedId(generatedId);
    setTreeData((prevData) => addItemToTree(prevData || [], targetFolderId, newItem));
  }, [addItemToTree]);

  const handleCreateRootFolder = () => {
    const generatedId = crypto.randomUUID();
    const newRoot = { id: generatedId, name: "Nowy bagaż (np. Walizka)", type: "folder", iconType: "suitcase", children: [] };
    setNewlyAddedId(generatedId);
    setTreeData((prevData) => [...(prevData || []), newRoot]);
  };

  const handleRenameItem = useCallback((targetId, newName, optionalAutoIcon) => {
    const updates = optionalAutoIcon ? { name: newName, iconType: optionalAutoIcon } : { name: newName };
    setTreeData((prevData) => updateItemInTree(prevData || [], targetId, updates));
  }, [updateItemInTree]);

  const handleChangeIcon = useCallback((targetId, newIconType) => {
    setTreeData((prevData) => updateItemInTree(prevData || [], targetId, { iconType: newIconType }));
  }, [updateItemInTree]);

  const getAllChildIds = (item) => {
    let ids = [item.id];
    if (item.children) item.children.forEach(c => { ids = [...ids, ...getAllChildIds(c)]; });
    return ids;
  };

  const handleDeleteItem = useCallback((targetNode) => {
    const idsToRemove = getAllChildIds(targetNode);
    setCheckedIds((prevChecked) => {
      const newChecked = new Set(prevChecked);
      idsToRemove.forEach((id) => newChecked.delete(id));
      if (onSelectionChange) onSelectionChange(Array.from(newChecked));
      return newChecked;
    });
    setTreeData((prevData) => removeItemFromTree(prevData || [], targetNode.id));
    setHoverBounds(null);
  }, [removeItemFromTree, onSelectionChange]);

  const handleToggleCheck = useCallback((item) => {
    setCheckedIds((prevChecked) => {
      const newChecked = new Set(prevChecked);
      const allRelatedIds = getAllChildIds(item);
      if (newChecked.has(item.id)) {
        allRelatedIds.forEach(id => newChecked.delete(id));
      } else {
        allRelatedIds.forEach(id => newChecked.add(id));
      }
      if (onSelectionChange) onSelectionChange(Array.from(newChecked));
      return newChecked;
    });
  }, [onSelectionChange]);

  const contextValue = useMemo(() => ({
    rowContainerRef,
    hoverBounds,
    setHoverBounds
  }), [hoverBounds]);

  return (
    <TreeContext.Provider value={contextValue}>
      <div 
        ref={containerRef} 
        className="w-[640px] h-fitbg-white dark:bg-zinc-950 flex flex-col relative z-10"
      >
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-100 dark:border-zinc-900 relative z-20">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Your luggage</span>
          <button onClick={handleCreateRootFolder} type="button" className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 px-2 py-1 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-md transition-colors">
            <Plus size={14} />
            <span>New luggage</span>
          </button>
        </div>
        
        <div ref={rowContainerRef} onMouseLeave={() => setHoverBounds(null)} className="relative w-full isolate z-10">
          <HoverHighlight />
          {treeData.map((node) => (
            <TreeNode 
              key={node.id} 
              node={node} 
              checkedIds={checkedIds} 
              onToggleCheck={handleToggleCheck} 
              onAddItem={handleAddItem} 
              onRenameItem={handleRenameItem} 
              onDeleteItem={handleDeleteItem} 
              onChangeIcon={handleChangeIcon} 
              newlyAddedId={newlyAddedId} 
              clearNewlyAddedId={() => setNewlyAddedId(null)} 
            />
          ))}
        </div>
      </div>
    </TreeContext.Provider>
  );
}