import { NextResponse } from "next/server";
import { generateSlideMap } from "@/lib/ai/generateSlideMap";
import { extractPptxText } from "@/lib/utils/pptxParser";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const title = formData.get("title");
    const description = formData.get("description");
    const difficulty = formData.get("difficulty");
    const packageLevel = formData.get("packageLevel");
    const estimatedDuration = formData.get("estimatedDuration");

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.pptx')) {
      return NextResponse.json(
        { error: "Only PPTX files are supported" },
        { status: 400 }
      );
    }

    console.log(`Processing presentation: ${title}`);
    console.log(`File: ${file.name}, Size: ${file.size} bytes`);

    // Extract text from PPTX
    const pptxText = await extractPptxText(file);
    console.log(`Extracted text length: ${pptxText.length} characters`);

    // Generate slide map using AI
    console.log("Generating slide map with AI...");
    const slideMap = await generateSlideMap(pptxText);

    if (!slideMap) {
      return NextResponse.json(
        { error: "Failed to generate slide map from presentation" },
        { status: 500 }
      );
    }

    // Enhance the slide map with form data
    const enhancedSlideMap = {
      ...slideMap,
      moduleTitle: title || slideMap.moduleTitle,
      description: description || "",
      difficulty: difficulty || slideMap.difficulty,
      packageLevel: packageLevel || "INTERMEDIATE",
      estimatedDuration: parseInt(estimatedDuration) || slideMap.estimatedDurationMin,
      createdAt: new Date().toISOString(),
      status: "processed"
    };

    console.log("Slide map generated successfully:", {
      title: enhancedSlideMap.moduleTitle,
      slidesCount: enhancedSlideMap.slides?.length || 0,
      difficulty: enhancedSlideMap.difficulty,
      duration: enhancedSlideMap.estimatedDuration
    });

    // Here you would typically save to database
    // For now, we'll return the processed data
    return NextResponse.json({
      success: true,
      module: enhancedSlideMap,
      message: "Presentation processed successfully"
    });

  } catch (error) {
    console.error("Error processing presentation:", error);
    return NextResponse.json(
      { error: "Failed to process presentation: " + error.message },
      { status: 500 }
    );
  }
}


