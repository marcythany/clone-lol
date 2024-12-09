import { NextRequest, NextResponse } from 'next/server';
import { RitoApi } from '~/lib/riot/RiotApi';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const apiKey = process.env.RIOT_API_KEY; 
  if (!apiKey) {
    throw new Error('RIOT_API_KEY is not defined');
  }
  
  const ritoApi = new RitoApi(apiKey);

  try {
    // Obter a versão do Data Dragon
    const versions = await ritoApi.getDataDragonVersion();
    const latestVersion = versions[0];

    // Construct the Data Dragon URL
    const datadragonUrl = `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/profileicon/${params.id}.png`;

    // Fetch the image from Data Dragon
    const response = await fetch(datadragonUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    // Get the image buffer
    const imageBuffer = await response.arrayBuffer();

    // Return the image with proper headers
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
    });
  } catch (error) {
    console.error('Error fetching avatar:', error);
    return new NextResponse('Error fetching avatar', { status: 500 });
  }
}
