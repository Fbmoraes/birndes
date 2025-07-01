-- Supabase Database Setup for PrintsBrindes
-- Execute these commands in your Supabase SQL Editor

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  images TEXT[] DEFAULT '{}',
  main_image TEXT DEFAULT '/placeholder.svg?height=400&width=400',
  show_on_home BOOLEAN DEFAULT false,
  slug VARCHAR(255) UNIQUE NOT NULL,
  personalization TEXT,
  production_time VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create catalog_items table
CREATE TABLE IF NOT EXISTS catalog_items (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  background_color VARCHAR(50) DEFAULT 'bg-gray-200',
  text_color VARCHAR(50) DEFAULT 'text-gray-700',
  button_color VARCHAR(100) DEFAULT 'border-gray-500 text-gray-500',
  product_ids INTEGER[] DEFAULT '{}',
  slug VARCHAR(255) UNIQUE NOT NULL,
  image TEXT DEFAULT '/placeholder.svg?height=200&width=300',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  whatsapp_number VARCHAR(20) DEFAULT '(21) 99930-0409',
  email VARCHAR(255) DEFAULT 'contato@printsbrindes.com',
  facebook_url TEXT DEFAULT 'https://facebook.com/printsbrindes',
  instagram_url TEXT DEFAULT 'https://instagram.com/printsbrindes',
  whatsapp_url TEXT DEFAULT 'https://wa.me/5521999300409',
  seo_title TEXT DEFAULT 'PrintsBrindes - Presentes e Artigos Personalizados',
  seo_description TEXT DEFAULT 'Presentes e artigos para festas personalizados! Canecas, cadernos, bolos e muito mais, tudo personalizado do seu jeito!',
  seo_keywords TEXT DEFAULT 'presentes personalizados, brindes, festas, canecas, cadernos, bolos',
  google_analytics_id VARCHAR(50) DEFAULT 'G-PS2KYDM9N0',
  google_search_console_id VARCHAR(100) DEFAULT '',
  facebook_pixel_id VARCHAR(50) DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create seo_data table
CREATE TABLE IF NOT EXISTS seo_data (
  id SERIAL PRIMARY KEY,
  page_path VARCHAR(255) UNIQUE NOT NULL,
  page_title TEXT,
  meta_description TEXT,
  keywords TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  canonical_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_catalog_items_slug ON catalog_items(slug);
CREATE INDEX IF NOT EXISTS idx_catalog_items_active ON catalog_items(is_active);
CREATE INDEX IF NOT EXISTS idx_seo_data_path ON seo_data(page_path);

-- Insert default products
INSERT INTO products (name, description, price, category, images, main_image, show_on_home, slug, personalization, production_time, is_active) VALUES
('Relógio Personalizado', 'Relógios personalizados para festas e lembrancinhas, com tema, nome e idade à sua escolha!', 9.90, 'relógios', ARRAY['/placeholder.svg?height=400&width=400'], '/placeholder.svg?height=400&width=400', true, 'relogio-personalizado', 'Nome, idade e tema personalizados', '3-5 dias úteis', true),
('Caderno de Colorir', 'Caderno de colorir personalizado para festas, lembrancinhas e diversão criativa!', 7.90, 'cadernos', ARRAY['/placeholder.svg?height=400&width=400'], '/placeholder.svg?height=400&width=400', true, 'caderno-colorir', 'Nome e tema personalizados', '2-4 dias úteis', true),
('Bolos Personalizados', 'Celebre momentos especiais com bolos deliciosos e personalizados com o tema da sua festa.', 25.00, 'bolos', ARRAY['/placeholder.svg?height=400&width=400'], '/placeholder.svg?height=400&width=400', true, 'bolos-personalizados', 'Tema, cores e decoração personalizados', '5-7 dias úteis', true)
ON CONFLICT (slug) DO NOTHING;

-- Insert default catalog items
INSERT INTO catalog_items (title, description, background_color, text_color, button_color, product_ids, slug, image, is_active) VALUES
('Relógios Personalizados', 'Relógios digitais personalizados com nome, letra ou frase especial. Perfeitos para lembrancinhas de festas, presentes criativos...', 'bg-pink-200', 'text-pink-700', 'border-pink-500 text-pink-500 hover:bg-pink-50', ARRAY[1], 'relogios', '/placeholder.svg?height=200&width=300', true),
('Bolos Personalizados', 'Celebre momentos especiais com bolos deliciosos e personalizados com o tema da sua festa. Um toque doce e único!', 'bg-yellow-200', 'text-yellow-700', 'border-yellow-500 text-yellow-600 hover:bg-yellow-50', ARRAY[3], 'bolos', '/placeholder.svg?height=200&width=300', true),
('Cadernos de Colorir Personalizados', 'Cadernos de colorir personalizados com nome e tema à sua escolha. Ideais para festas, lembrancinhas e para estimular a...', 'bg-purple-200', 'text-purple-700', 'border-purple-500 text-purple-500 hover:bg-purple-50', ARRAY[2], 'cadernos', '/placeholder.svg?height=200&width=300', true)
ON CONFLICT (slug) DO NOTHING;

-- Insert default settings
INSERT INTO settings (id, whatsapp_number, email, facebook_url, instagram_url, whatsapp_url, seo_title, seo_description, seo_keywords, google_analytics_id, google_search_console_id, facebook_pixel_id) VALUES
(1, '(21) 99930-0409', 'contato@printsbrindes.com', 'https://facebook.com/printsbrindes', 'https://instagram.com/printsbrindes', 'https://wa.me/5521999300409', 'PrintsBrindes - Presentes e Artigos Personalizados', 'Presentes e artigos para festas personalizados! Canecas, cadernos, bolos e muito mais, tudo personalizado do seu jeito!', 'presentes personalizados, brindes, festas, canecas, cadernos, bolos', 'G-PS2KYDM9N0', '', '')
ON CONFLICT (id) DO UPDATE SET
  whatsapp_number = EXCLUDED.whatsapp_number,
  email = EXCLUDED.email,
  facebook_url = EXCLUDED.facebook_url,
  instagram_url = EXCLUDED.instagram_url,
  whatsapp_url = EXCLUDED.whatsapp_url,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  seo_keywords = EXCLUDED.seo_keywords,
  google_analytics_id = EXCLUDED.google_analytics_id,
  updated_at = NOW();

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_data ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access on catalog_items" ON catalog_items FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access on settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Allow public read access on seo_data" ON seo_data FOR SELECT USING (true);

-- Create policies for authenticated write access (you can modify these based on your auth setup)
CREATE POLICY "Allow authenticated insert on products" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on products" ON products FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on products" ON products FOR DELETE USING (true);

CREATE POLICY "Allow authenticated insert on catalog_items" ON catalog_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on catalog_items" ON catalog_items FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on catalog_items" ON catalog_items FOR DELETE USING (true);

CREATE POLICY "Allow authenticated update on settings" ON settings FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated insert on settings" ON settings FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated insert on seo_data" ON seo_data FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on seo_data" ON seo_data FOR UPDATE USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_catalog_items_updated_at BEFORE UPDATE ON catalog_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_seo_data_updated_at BEFORE UPDATE ON seo_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();