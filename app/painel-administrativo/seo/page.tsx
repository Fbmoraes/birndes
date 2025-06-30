"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface SEOConfig {
  siteTitle: string
  siteDescription: string
  keywords: string
  googleAnalyticsId: string
  googleSearchConsoleId: string
  facebookPixelId: string
}

const defaultConfig: SEOConfig = {
  siteTitle: "",
  siteDescription: "",
  keywords: "",
  googleAnalyticsId: "",
  googleSearchConsoleId: "",
  facebookPixelId: "",
}

export default function SEODashboardPage() {
  const router = useRouter()
  const [seoConfig, setSeoConfig] = useState<SEOConfig>(defaultConfig)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Carregar configurações do backend
  useEffect(() => {
    fetch("/api/seo-settings")
      .then(res => res.json())
      .then(data => setSeoConfig({ ...defaultConfig, ...data }))
      .finally(() => setLoading(false))
  }, [])

  // Salvar configurações no backend
  async function handleSaveSEOConfig() {
    setSaving(true)
    try {
      const res = await fetch("/api/seo-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(seoConfig),
      })
      if (!res.ok) throw new Error("Erro ao salvar")
      alert("Configurações de SEO salvas com sucesso!")
    } catch {
      alert("Erro ao salvar configurações.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Carregando configurações...</div>
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8">Painel Administrativo</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="border rounded p-4">
          <h2 className="text-lg font-semibold mb-2">Configurações SEO</h2>
          <label className="block text-sm mt-3">
            Título Principal do Site
            <input
              className="mt-1 block w-full border rounded p-1"
              value={seoConfig.siteTitle}
              onChange={e => setSeoConfig({ ...seoConfig, siteTitle: e.target.value })}
            />
          </label>
          <label className="block text-sm mt-3">
            Descrição Meta
            <textarea
              className="mt-1 block w-full border rounded p-1"
              rows={3}
              value={seoConfig.siteDescription}
              onChange={e => setSeoConfig({ ...seoConfig, siteDescription: e.target.value })}
            />
          </label>
          <label className="block text-sm mt-3">
            Palavras-chave Principais
            <textarea
              className="mt-1 block w-full border rounded p-1"
              rows={2}
              value={seoConfig.keywords}
              onChange={e => setSeoConfig({ ...seoConfig, keywords: e.target.value })}
            />
          </label>
        </div>

        <div className="border rounded p-4">
          <h2 className="text-lg font-semibold mb-2">Google Analytics &amp; Search Console</h2>
          <label className="block text-sm mt-3">
            Google Analytics ID
            <input
              className="mt-1 block w-full border rounded p-1"
              placeholder="G-XXXXXXXXXX"
              value={seoConfig.googleAnalyticsId}
              onChange={e => setSeoConfig({ ...seoConfig, googleAnalyticsId: e.target.value })}
            />
          </label>
          <label className="block text-sm mt-3">
            Google Search Console
            <input
              className="mt-1 block w-full border rounded p-1"
              placeholder="Código de verificação"
              value={seoConfig.googleSearchConsoleId}
              onChange={e => setSeoConfig({ ...seoConfig, googleSearchConsoleId: e.target.value })}
            />
          </label>
          <label className="block text-sm mt-3">
            Facebook Pixel ID
            <input
              className="mt-1 block w-full border rounded p-1"
              value={seoConfig.facebookPixelId}
              onChange={e => setSeoConfig({ ...seoConfig, facebookPixelId: e.target.value })}
            />
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          className="mt-4 py-2 px-4 bg-pink-500 text-white rounded hover:bg-pink-600"
          onClick={handleSaveSEOConfig}
          disabled={saving}
        >
          {saving ? "Salvando..." : "Salvar Configurações SEO"}
        </button>
      </div>
    </div>
  )
}
