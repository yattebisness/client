"use client"

import Menu from '../../composants/Menu'

import "./Produits.css";
import { useState, useEffect } from 'react'
import { useSearchStore, useCategoryStore } from "../../stores/Store"
import { Donnees } from "../../fetching/Donnees"
import { Data } from "../../fetching/Data"
import React from "react"

import { useModal } from "../../contextes/ModalContext"
import Modal from "../../composants/Modal"
import Produit from "./Produit" 

const normalizeText = (text) => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
};

export default function Produits() {
  const { showModal } = useModal()

  const [cat, setCat] = useState([])
  const [donnees, setDonnees] = useState([])

  const { searchQuery } = useSearchStore()
  const { selectedCategory } = useCategoryStore()

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pageSize] = useState(12)

  useEffect(() => {
    const fetchdata = async () => {
      const result = await Donnees()
      setDonnees(result)
      setTotalPages(Math.ceil(result.length / pageSize))
    }
    fetchdata()
  }, [pageSize])

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  useEffect(() => {
    const fetchdata = async () => {
      const data = await Data()
      setCat(data)
    }
    fetchdata()
  }, [])

  const donneesAvecCategorie = donnees.map(item => {
    const categoryInfo = cat.find(c => c.id === item.category);
    return {
      ...item,
      categoryName: categoryInfo ? categoryInfo.name : ""
    };
  });

  const normalizedSearch = normalizeText(searchQuery)
  const searchTerms = normalizedSearch.split(" ")

  const filteredData = donneesAvecCategorie
    .filter(item => {
      const matchesCategory = !selectedCategory || item.category === selectedCategory.id;

      const nameMatch = searchTerms.every(term =>
        normalizeText(item.name).includes(term)
      );
      const categoryMatch = searchTerms.every(term =>
        normalizeText(item.categoryName).includes(term)
      );
      const descriptionMatch = item.description
        ? searchTerms.every(term =>
            normalizeText(item.description).includes(term)
          )
        : false;

      return matchesCategory && (nameMatch || categoryMatch || descriptionMatch);
    })
    .reverse();

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = filteredData.slice(startIndex, endIndex);

  return (
    <div className="Produits">
      <Menu />
      {showModal ? <Modal /> : ""}
      <div className="Donnees">
        {currentData.map((item) => (
          <Produit key={item.id} {...item} item={item} />
        ))}
      </div>

      <div>
        {totalPages > 1 && (
          <div className="containerPagination">
            <ul className="pagination">
              {currentPage > 1 && (
                <li className="page-item">
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    &laquo;
                  </button>
                </li>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page =>
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 2 && page <= currentPage + 2)
                )
                .map((page, i, arr) => {
                  const prevPage = arr[i - 1];
                  const isEllipsis = prevPage && page - prevPage > 1;

                  return (
                    <React.Fragment key={page}>
                      {isEllipsis && (
                        <li className="page-item disabled">
                          <span className="page-link">...</span>
                        </li>
                      )}
                      <li className={`page-item ${currentPage === page ? "active" : ""}`}>
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      </li>
                    </React.Fragment>
                  );
                })}

              {currentPage < totalPages && (
                <li className="page-item">
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    &raquo;
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
